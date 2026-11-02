import {
    Entity,
    PrimaryColumn,
    Column,
    ManyToOne,
    JoinColumn,
    Index,
    PrimaryGeneratedColumn,
} from 'typeorm';

import { Match } from './match.entity';
import { Player } from '../../players/entities/player.entity';

@Entity('match_participants')
@Index(['puuid'])
@Index(['championId'])
@Index(['matchId', 'puuid'], { unique: true })
export class MatchParticipant {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    matchId: string;

    @ManyToOne(
        () => Match,
        (match) => match.participants,
        { onDelete: 'CASCADE' },
    )
    @JoinColumn({
        name: 'matchId',
        referencedColumnName: 'matchId',
    })
    match: Match;

    @Column()
    puuid: string;

    @Column({ nullable: true })
    playerPuuid: string | null;

    @Column()
    championId: number;

    @Column()
    championName: string;

    @Column()
    teamId: number;

    @Column({ nullable: true })
    teamPosition: string;

    @Column()
    individualPosition: string;

    @Column()
    kills: number;

    @Column()
    deaths: number;

    @Column()
    assists: number;

    @Column()
    win: boolean;

    @Column()
    goldEarned: number;

    @Column()
    totalDamageDealtToChampions: number;

    @Column()
    totalMinionsKilled: number;

    @Column()
    neutralMinionsKilled: number;

    @Column()
    champLevel: number;

    @Column({ nullable: true })
    summoner1Id: number;

    @Column({ nullable: true })
    summoner2Id: number;

    @ManyToOne(
        () => Player,
        (player) => player.participants,
        {
            nullable: true,
            onDelete: 'SET NULL',
        },
    )
    @JoinColumn({
        name: 'playerPuuid',
        referencedColumnName: 'puuid',
    })
    player: Player | null;

}