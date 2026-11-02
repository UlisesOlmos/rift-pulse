import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Player } from "./entities/player.entity";
import { Repository } from "typeorm";
import { RiotEntry, RiotRegion } from "../riot/riot.interface";
import { PlayerRankSnapshot } from "./entities/play-rank-snapshot.entity";

@Injectable()
export class PlayersService {

  constructor(
    @InjectRepository(Player)
    private readonly playerRepository: Repository<Player>,
    @InjectRepository(PlayerRankSnapshot)
    private readonly snapshotRepository: Repository<PlayerRankSnapshot>,
  ) { }

  async savePlayers(players: Partial<Player>[]) {
    if (!players.length) return;

    await this.playerRepository.upsert(
      players,
      ['puuid'],
    );
  }

  async savePlayer(player: Partial<Player>) {

    await this.playerRepository.upsert(
      player,
      ['puuid'],
    );
  }

  async savePlayersBulk(
    entries: RiotEntry[],
    region: RiotRegion,
  ) {
    const players = entries.map((entry) => ({
      puuid: entry.puuid,
      region,
    }));

    await this.playerRepository.upsert(
      players,
      ['puuid'],
    );
  }

  async findByPuuid(puuid: string) {
    return this.playerRepository.findOne({
      where: { puuid: puuid },
    });
  }

  async findAll(region: RiotRegion) {
    return this.playerRepository.find({
      where: { region },
    });
  }


  async saveRankSnapshot(
    puuid: string,
    entry: RiotEntry,
  ): Promise<PlayerRankSnapshot> {

    const latest = await this.snapshotRepository.findOne({
      where: {
        puuid,
        queueType: entry.queueType,
      },
      order: {
        capturedAt: 'DESC',
      },
    });

    if (
      latest &&
      latest.tier === entry.tier &&
      latest.division === entry.rank &&
      latest.leaguePoints === entry.leaguePoints &&
      latest.wins === entry.wins &&
      latest.losses === entry.losses
    ) {
      return latest;
    }

    const snapshot = this.snapshotRepository.create({
      puuid,
      queueType: entry.queueType,
      tier: entry.tier,
      division: entry.rank,
      leaguePoints: entry.leaguePoints,
      wins: entry.wins,
      losses: entry.losses,
    });

    return this.snapshotRepository.save(snapshot);
  }

  async saveRankSnapshotsBulk(entries: RiotEntry[]) {
    const puuids = entries.map((entry) => entry.puuid);

    const latestSnapshots = await this.snapshotRepository
      .createQueryBuilder('snapshot')
      .distinctOn(['snapshot.puuid', 'snapshot.queueType'])
      .where('snapshot.puuid IN (:...puuids)', { puuids })
      .orderBy('snapshot.puuid', 'ASC')
      .addOrderBy('snapshot.queueType', 'ASC')
      .addOrderBy('snapshot.capturedAt', 'DESC')
      .getMany();

    const latestMap = new Map(
      latestSnapshots.map((snapshot) => [
        `${snapshot.puuid}-${snapshot.queueType}`,
        snapshot,
      ]),
    );

    const newSnapshots = entries
      .filter((entry) => {
        const latest = latestMap.get(
          `${entry.puuid}-${entry.queueType}`,
        );

        if (!latest) return true;

        return (
          latest.tier !== entry.tier ||
          latest.division !== entry.rank ||
          latest.leaguePoints !== entry.leaguePoints ||
          latest.wins !== entry.wins ||
          latest.losses !== entry.losses
        );
      })
      .map((entry) =>
        this.snapshotRepository.create({
          puuid: entry.puuid,
          queueType: entry.queueType,
          tier: entry.tier,
          division: entry.rank,
          leaguePoints: entry.leaguePoints,
          wins: entry.wins,
          losses: entry.losses,
        }),
      );

    if (newSnapshots.length > 0) {
      await this.snapshotRepository.insert(newSnapshots);
    }

    return {
      received: entries.length,
      inserted: newSnapshots.length,
      skipped: entries.length - newSnapshots.length,
    };
  }
}