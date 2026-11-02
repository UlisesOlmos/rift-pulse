import {
    Entity,
    PrimaryColumn,
    Column,
    ManyToOne,
    JoinColumn,
} from 'typeorm';

import { Match } from './match.entity';
import { Player } from '../../players/entities/player.entity';

@Entity('match_participants')
export class MatchParticipant {
    @PrimaryColumn()
    matchId: string;

    @PrimaryColumn()
    puuid: string;

    @Column()
    championId: number;

    @Column()
    teamId: number;

    @Column({ nullable: true })
    teamPosition: string;

    @Column()
    win: boolean;

    @Column()
    kills: number;

    @Column()
    deaths: number;

    @Column()
    assists: number;

    @Column()
    goldEarned: number;

    @ManyToOne(() => Match, (match) => match.participants)
    @JoinColumn({ name: 'matchId' })
    match: Match;

    @ManyToOne(() => Player, (player) => player.participants)
    @JoinColumn({ name: 'puuid' })
    player: Player;
}