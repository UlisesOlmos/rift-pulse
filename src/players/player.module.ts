import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Player } from "./entities/player.entity";
import { PlayerRankSnapshot } from "./entities/play-rank-snapshot.entity";
import { PlayersService } from "./players.service";

@Module({
    imports: [
        TypeOrmModule.forFeature([
            Player,
            PlayerRankSnapshot,
        ]),
    ],
    providers: [PlayersService],
    exports: [PlayersService],
})
export class PlayersModule { }
