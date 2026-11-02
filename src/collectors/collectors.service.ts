import { Injectable } from "@nestjs/common";
import { RiotService } from "../riot/riot.service";
import { RiotQueueType, RiotRank, RiotRegion, RiotTier } from "../riot/riot.interface";
import { PlayersService } from "../players/players.service";
import { Player } from "../players/entities/player.entity";
import { InjectQueue } from "@nestjs/bullmq";
import { Job, Queue } from "bullmq";
import { InjectRepository } from "@nestjs/typeorm";
import { CollectionCursor } from "./entities/collector-cursor.entity";
import { Repository } from "typeorm";

@Injectable()
export class CollectorsService {

  constructor(
    private readonly riotService: RiotService,
    private readonly playersService: PlayersService,

    @InjectQueue('player-collection')
    private readonly collectionQueue: Queue,

    @InjectRepository(CollectionCursor)
    private readonly cursorRepository: Repository<CollectionCursor>,
  ) { }

  async startCollection(
    region: RiotRegion,
    tier: RiotTier,
    division: RiotRank,
  ) {

    const jobId = `${region}-${tier}-${division}`;

    const existingJob = await this.collectionQueue.getJob(jobId);

    if (existingJob) {
      const state = await existingJob.getState();

      if (
        ['waiting', 'active', 'delayed', 'paused', 'waiting-children'].includes(state)
      ) {
        return {
          message: 'Collection already running',
          jobId: existingJob.id,
          state,
        };
      }
    }

    const job = await this.collectionQueue.add(
      'collect-players',
      {
        region,
        tier,
        division,
      },
      {
        jobId,
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 5000,
        },
        removeOnComplete: 100,
        removeOnFail: false,
      },
    );

    return {
      message: 'Collection started',
      jobId: job.id,
    };
  }

  async getCollections() {
    const [waiting, active, completed, failed] =
      await Promise.all([
        this.collectionQueue.getWaiting(),
        this.collectionQueue.getActive(),
        this.collectionQueue.getCompleted(),
        this.collectionQueue.getFailed(),
      ]);

    return {
      waiting: waiting.map(job => ({
        id: job.id,
        data: job.data,
      })),

      active: active.map(job => ({
        id: job.id,
        data: job.data,
        progress: job.progress,
      })),

      completed: completed.map(job => ({
        id: job.id,
        data: job.data,
      })),

      failed: failed.map(job => ({
        id: job.id,
        data: job.data,
        reason: job.failedReason,
      })),
    };
  }

  async collectPlayers(
    region: RiotRegion,
    tier: RiotTier,
    division: RiotRank,
    job?: Job
  ) {

    const cursor = await this.getOrCreateCursor(
      region,
      tier,
      division,
    );

    let page = cursor.lastPage + 1;
    let totalPlayers = cursor.totalPlayers;

    while (page == 1) {
      const entries = await this.riotService.getSummonersData(
        region,
        {
          queue: RiotQueueType.RANKED_SOLO_5x5,
          tier,
          division,
          page,
        },
      );

      if (entries.length === 0) {
        cursor.completed = true;
        await this.cursorRepository.save(cursor);
        break;
      }

      await this.playersService.savePlayersBulk(
        entries,
        region,
      );

      const snapshotResult =
        await this.playersService.saveRankSnapshotsBulk(entries);

      totalPlayers += entries.length;

      cursor.lastPage = page;
      cursor.totalPlayers = totalPlayers;

      await this.cursorRepository.save(cursor);

      await job?.updateProgress({
        page,
        totalPlayers,
        snapshotsInserted: snapshotResult.inserted,
      });

      page++;
    }

    return {
      region,
      tier,
      division,
      totalPlayers,
      pagesCollected: cursor.lastPage,
      completed: cursor.completed
    };
  }

  async getJobStatus(jobId: string) {
    const job = await this.collectionQueue.getJob(jobId);

    if (!job) {
      return null;
    }

    const state = await job.getState();

    return {
      jobId: job.id,
      state,
      progress: job.progress,
      result: job.returnvalue,
      failedReason: job.failedReason,
    };
  }

  async getOrCreateCursor(
    region: RiotRegion,
    tier: RiotTier,
    division: RiotRank,
  ) {
    let cursor = await this.cursorRepository.findOne({
      where: {
        region,
        tier,
        division,
        completed: false,
      },
    });

    if (!cursor) {
      cursor = this.cursorRepository.create({
        region,
        tier,
        division,
        lastPage: 0,
        totalPlayers: 0,
      });

      cursor = await this.cursorRepository.save(cursor);
    }

    return cursor;
  }
}