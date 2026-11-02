import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Player } from '../players/entities/player.entity';
import { PlayerMatchCursor } from './entities/player-match-cursor.entity';

import { RiotService } from '../riot/riot.service';
import {
  RIOT_REGION_CONFIG,
  RiotMatch,
  RiotRegion,
} from '../riot/riot.interface';

import { MatchesService } from '../matches/matches.service';

@Injectable()
export class MatchCollectorService {

  constructor(
    @InjectRepository(Player)
    private readonly playerRepository: Repository<Player>,

    @InjectRepository(PlayerMatchCursor)
    private readonly cursorRepository: Repository<PlayerMatchCursor>,

    private readonly riotService: RiotService,
    private readonly matchesService: MatchesService,
  ) { }

  async collectPlayerMatches(puuid: string) {

    const player = await this.playerRepository.findOne({
      where: { puuid },
    });

    if (!player) {
      throw new NotFoundException('Player not found');
    }

    const region = player.region as RiotRegion;
    const regionalRoute = RIOT_REGION_CONFIG[region].regional;

    let cursor = await this.cursorRepository.findOne({
      where: { puuid },
    });

    if (!cursor) {
      cursor = this.cursorRepository.create({
        puuid,
        lastMatchId: null,
        lastCollectedAt: null,
        initialBackfillCompleted: false,
        totalMatchesCollected: 0,
        lastError: null,
      });

      await this.cursorRepository.save(cursor);
    }

    const matchIds = await this.riotService.getMatchesBySummoner(
      region,
      puuid,
      {
        start: 0,
        count: 20,
      },
    );

    let newMatches = 0;

    for (const matchId of matchIds) {

      if (matchId === cursor.lastMatchId) {
        break;
      }

      const match: RiotMatch = await this.riotService.getMatch(
        region,
        matchId,
      );


      const result = await this.matchesService.saveMatch(
        match,
        regionalRoute,
      );

      if (result.inserted) {
        newMatches++;
      }
    }


    if (matchIds.length > 0) {
      cursor.lastMatchId = matchIds[0];
    }

    cursor.lastCollectedAt = new Date();
    cursor.totalMatchesCollected += newMatches;
    cursor.lastError = null;

    await this.cursorRepository.save(cursor);

    return {
      puuid,
      region,
      matchesChecked: matchIds.length,
      newMatches,
      lastMatchId: cursor.lastMatchId,
    };
  }
}