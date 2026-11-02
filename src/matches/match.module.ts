import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Match } from "./entities/match.entity";
import { MatchParticipant } from "./entities/match-participant.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Match,
      MatchParticipant,
    ]),
  ]
})
export class MatchesModule {}