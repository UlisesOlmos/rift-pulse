import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Player } from "../players/entities/player.entity";
import { PlayerMatchCursor } from "./entities/player-match-cursor.entity";
import { RiotModule } from "../riot/riot.module";
import { MatchesModule } from "../matches/match.module";
import { MatchCollectorService } from "./match-collectors.service";
import { MatchCollectorController } from "./match-collectors.controller";

@Module({
    imports: [
        TypeOrmModule.forFeature([
            Player,
            PlayerMatchCursor,
        ]),
        RiotModule,
        MatchesModule,
    ],
    providers: [
        MatchCollectorService,
    ],
    controllers: [
        MatchCollectorController,
    ],
    exports: [
        MatchCollectorService,
    ],
})

export class MatchCollectorModule { }