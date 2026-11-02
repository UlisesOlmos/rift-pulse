import { Injectable } from '@nestjs/common';
import { HttpClient, InjectHttpClient } from '@nestjs/http-client';
import { RIOT_REGION_CONFIG, RiotEntry, RiotMatch, RiotRegion } from './riot.interface';
import { RiotEntryParams, RiotMatchesParams } from './riot.dto';

@Injectable()
export class RiotService {

    constructor(
        @InjectHttpClient('riot')
        private readonly http: HttpClient,
    ) { }


    getSummoner(): string {
        return 'Hello World!';
    }

    async getMatch(region: RiotRegion, matchId: string): Promise<RiotMatch> {
        const config = RIOT_REGION_CONFIG[region]
        const url = `https://${config.regional}.api.riotgames.com/lol/match/v5/matches/${matchId}`

        const response = await this.http.get<RiotMatch>(url, {
            headers: {
                "X-Riot-Token": process.env.RIOT_API_KEY
            }
        });

        return response.data
    }

    async getMatchesBySummoner(region: RiotRegion, puuid: string, params: RiotMatchesParams): Promise<string[]> {
        const config = RIOT_REGION_CONFIG[region]
        const url = `https://${config.regional}.api.riotgames.com/lol/match/v5/matches/by-puuid/${puuid}/ids`


        const response = await this.http.get<string[]>(url, {
            headers: {
                "X-Riot-Token": process.env.RIOT_API_KEY
            },
            query: {
                ...params,
                "type": "ranked"
            },
        });

        return response.data
    }

    async getSummonersData(region: RiotRegion, params: RiotEntryParams): Promise<RiotEntry[]> {
        const { page, division, tier, queue } = params
        const config = RIOT_REGION_CONFIG[region]
        const url = `https://${config.platform}.api.riotgames.com/lol/league/v4/entries/${queue}/${tier}/${division}`


        const response = await this.http.get<RiotEntry[]>(url, {
            headers: {
                "X-Riot-Token": process.env.RIOT_API_KEY
            },
            query: {
                page,
            },
        });

        return response.data
    }
}
