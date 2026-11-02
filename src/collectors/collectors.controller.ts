import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { CollectorsService } from "./collectors.service";
import { RiotRank, RiotRegion, RiotTier } from "../riot/riot.interface";

@Controller("/collectors")
export class CollectorController {
    constructor(private readonly collectorsService: CollectorsService) { }

    @Post('players')
    async collectPlayers(
        @Body()
        body: {
            region: RiotRegion;
            tier: RiotTier;
            division: RiotRank;
        },
    ) {
        return this.collectorsService.startCollection(
            body.region,
            body.tier,
            body.division,
        );
    }

    @Get()
    getCollections() {
        return this.collectorsService.getCollections();
    }

    @Get('status/:jobId')
    async getJobStatus(
        @Param('jobId') jobId: string,
    ) {
        return this.collectorsService.getJobStatus(jobId);
    }
}