import {
    Controller,
    Post,
    Param,
} from '@nestjs/common';

import { MatchCollectorService } from './match-collectors.service';

@Controller('match-collector')
export class MatchCollectorController {

    constructor(
        private readonly matchCollectorService: MatchCollectorService,
    ) { }

    @Post(':puuid')
    collectPlayer(@Param('puuid') puuid: string) {
        return this.matchCollectorService.collectPlayerMatches(puuid);
    }
}