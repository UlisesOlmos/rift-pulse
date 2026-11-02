import { Injectable } from '@nestjs/common';
import { RiotService } from './riot/riot.service';
import { RiotQueueType, RiotRank, RiotRegion, RiotTier } from './riot/riot.interface';

@Injectable()
export class AppService {

  constructor(
    private riotService: RiotService
  ) { }

  getHello(): string {
    return 'Hello World!';
  }

  getData() {
    return this.riotService.getSummonersData(RiotRegion.LAS, { division: RiotRank.III, tier: RiotTier.DIAMOND, queue: RiotQueueType.RANKED_SOLO_5x5, page: 1 })
  }
}
