import { RiotService } from './riot.service';
import { HttpClient } from '@nestjs/http-client';
import {
    RiotMatch,
    RiotRegion,
    RiotEntry,
} from './riot.interface';
import { RiotEntryParams, RiotMatchesParams } from './riot.dto';

describe('RiotService', () => {
    let service: RiotService;

    const httpMock = {
        get: jest.fn(),
    };

    beforeEach(() => {
        jest.clearAllMocks();

        process.env.RIOT_API_KEY = 'test-api-key';

        service = new RiotService(
            httpMock as unknown as HttpClient,
        );
    });

    describe('getMatch', () => {
        it('should fetch a match from the correct regional server', async () => {
            const mockMatch = {
                metadata: {
                    matchId: 'LA2_123456',
                },
            } as RiotMatch;

            httpMock.get.mockResolvedValue({
                data: mockMatch,
            });

            const result = await service.getMatch(
                RiotRegion.LAS,
                'LA2_123456',
            );

            expect(httpMock.get).toHaveBeenCalledWith(
                'https://americas.api.riotgames.com/lol/match/v5/matches/LA2_123456',
                {
                    headers: {
                        'X-Riot-Token': 'test-api-key',
                    },
                },
            );

            expect(result).toEqual(mockMatch);
        });
    });

    describe('getMatchesBySummoner', () => {
        it('should fetch ranked matches from the correct region', async () => {
            const mockMatches = [
                'LA2_123456',
                'LA2_654321',
            ];

            httpMock.get.mockResolvedValue({
                data: mockMatches,
            });

            const params = {
                start: 0,
                count: 20,
            } as RiotMatchesParams;

            const result = await service.getMatchesBySummoner(
                RiotRegion.BR,
                'test-puuid',
                params,
            );

            expect(httpMock.get).toHaveBeenCalledWith(
                'https://americas.api.riotgames.com/lol/match/v5/matches/by-puuid/test-puuid/ids',
                {
                    headers: {
                        'X-Riot-Token': 'test-api-key',
                    },
                    query: {
                        start: 0,
                        count: 20,
                        type: 'ranked',
                    },
                },
            );

            expect(result).toEqual(mockMatches);
        });
    });

    describe('getSummonersData', () => {
        it('should fetch summoners from the correct platform', async () => {
            const mockEntries = [] as RiotEntry[];

            httpMock.get.mockResolvedValue({
                data: mockEntries,
            });

            const params = {
                page: 1,
                division: 'I',
                tier: 'GOLD',
                queue: 'RANKED_SOLO_5x5',
            } as RiotEntryParams;

            const result = await service.getSummonersData(
                RiotRegion.BR,
                params,
            );

            expect(httpMock.get).toHaveBeenCalledWith(
                'https://br1.api.riotgames.com/lol/league/v4/entries/RANKED_SOLO_5x5/GOLD/I',
                {
                    headers: {
                        'X-Riot-Token': 'test-api-key',
                    },
                    query: {
                        page: 1,
                    },
                },
            );

            expect(result).toEqual(mockEntries);
        });
    });

    describe('error handling', () => {
        it('should propagate Riot API errors', async () => {
            const error = new Error('Riot API Error');

            httpMock.get.mockRejectedValue(error);

            await expect(
                service.getMatch(
                    RiotRegion.LAS,
                    'LA2_123456',
                ),
            ).rejects.toThrow('Riot API Error');
        });
    });
});