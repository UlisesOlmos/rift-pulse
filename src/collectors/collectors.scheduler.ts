import { Injectable } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";
import { CollectorsService } from "./collectors.service";
import { RiotRank, RiotRegion, RiotTier } from "../riot/riot.interface";

@Injectable()
export class CollectorsScheduler {

    constructor(
        private readonly collectorsService: CollectorsService,
    ) { }

    @Cron(CronExpression.EVERY_10_MINUTES)
    async handleCollection() {

        await this.collectorsService.collectPlayers(
            RiotRegion.LAS,
            RiotTier.SILVER,
            RiotRank.IV,
        );

    }
}