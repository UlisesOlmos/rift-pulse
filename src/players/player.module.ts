import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Player } from "./entities/player.entity";
import { PlayerRankSnapshot } from "./entities/play-rank-snapshot.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Player,
      PlayerRankSnapshot,
    ]),
  ]
})
export class PlayersModule {}
