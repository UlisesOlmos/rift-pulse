import { Entity, Column, PrimaryColumn, CreateDateColumn, OneToMany, OneToOne } from 'typeorm';
import { MatchParticipant } from '../../matches/entities/match-participant.entity';
import { PlayerRankSnapshot } from './play-rank-snapshot.entity';
import { RiotRegion } from '../../riot/riot.interface';
import { PlayerMatchCursor } from '../../match-collectors/entities/player-match-cursor.entity';

@Entity('players')
export class Player {
    @PrimaryColumn({ type: 'varchar' })
    puuid: string;

    @Column({
        type: 'enum',
        enum: RiotRegion,
    })
    region: RiotRegion;

    @Column({ nullable: true })
    gameName: string;

    @Column({ nullable: true })
    tagLine: string;

    @CreateDateColumn()
    createdAt: Date;

    @Column({ type: 'timestamp', nullable: true })
    lastCheckedAt: Date;

    @OneToMany(
        () => MatchParticipant,
        (participant) => participant.player,
    )
    participants: MatchParticipant[];

    @OneToMany(() => PlayerRankSnapshot, (snapshot) => snapshot.player)
    rankSnapshots: PlayerRankSnapshot[];

    @OneToOne(
        () => PlayerMatchCursor,
        (cursor) => cursor.player,
    )
    matchCursor: PlayerMatchCursor;
}