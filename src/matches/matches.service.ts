import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Match } from './entities/match.entity';
import { MatchParticipant } from './entities/match-participant.entity';
import { RiotMatch, RiotRegionalRoute } from '../riot/riot.interface';

@Injectable()
export class MatchesService {
  constructor(
    @InjectRepository(Match)
    private readonly matchRepository: Repository<Match>,

    @InjectRepository(MatchParticipant)
    private readonly participantRepository: Repository<MatchParticipant>,
  ) { }

  async saveMatch(
    matchData: RiotMatch,
    region: RiotRegionalRoute,
  ) {
    const { metadata, info } = matchData;

    const existingMatch = await this.matchRepository.findOne({
      where: {
        matchId: metadata.matchId,
      },
    });

    if (existingMatch) {
      return {
        matchId: metadata.matchId,
        inserted: false,
      };
    }

    const match = this.matchRepository.create({
      matchId: metadata.matchId,
      region,
      gameCreation: String(info.gameCreation),
      gameDuration: String(info.gameDuration),
      gameMode: info.gameMode,
      queueId: info.queueId,
      gameVersion: info.gameVersion,
    });

    const participants = info.participants.map((participant) =>
      this.participantRepository.create({
        puuid: participant.puuid,
        matchId: metadata.matchId,
        championId: participant.championId,
        championName: participant.championName,
        teamId: participant.teamId,
        teamPosition: participant.teamPosition,
        individualPosition: participant.individualPosition,
        kills: participant.kills,
        deaths: participant.deaths,
        assists: participant.assists,
        win: participant.win,
        goldEarned: participant.goldEarned,
        totalDamageDealtToChampions:
          participant.totalDamageDealtToChampions,
        totalMinionsKilled: participant.totalMinionsKilled,
        neutralMinionsKilled: participant.neutralMinionsKilled,
        champLevel: participant.champLevel,
        summoner1Id: participant.summoner1Id,
        summoner2Id: participant.summoner2Id,
      }),
    );

    await this.matchRepository.manager.transaction(
      async (manager) => {
        await manager.insert(Match, match);
        await manager.insert(MatchParticipant, participants);
      },
    );

    return {
      matchId: metadata.matchId,
      inserted: true,
      participants: participants.length,
    };
  }

  async matchExists(matchId: string): Promise<boolean> {
    return this.matchRepository.exists({
      where: {
        matchId,
      },
    });
  }
}

