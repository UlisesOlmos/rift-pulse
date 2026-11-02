import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';

import { CollectorsService } from './collectors.service';
import {
  RiotRegion,
  RiotTier,
  RiotRank,
} from '../riot/riot.interface';

interface CollectPlayersJob {
  region: RiotRegion;
  tier: RiotTier;
  division: RiotRank;
}

@Processor('player-collection', {
  concurrency: 1,
})
export class CollectorsProcessor extends WorkerHost {

  constructor(
    private readonly collectorsService: CollectorsService,
  ) {
    super();
  }

  async process(job: Job<CollectPlayersJob>) {

    switch (job.name) {
      case 'collect-players': {
        const { region, tier, division } = job.data;

        return this.collectorsService.collectPlayers(
          region,
          tier,
          division,
          job
        );
      }

      default:
        throw new Error(`Unknown job: ${job.name}`);
    }
  }
}