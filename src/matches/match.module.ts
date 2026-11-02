import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Match } from "./entities/match.entity";
import { MatchParticipant } from "./entities/match-participant.entity";
import { MatchesService } from "./matches.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Match,
      MatchParticipant,
    ]),
  ],
  providers: [MatchesService],
  exports: [MatchesService],
})
export class MatchesModule { }