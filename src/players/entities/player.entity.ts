import { Entity, Column, PrimaryColumn, CreateDateColumn, OneToMany } from 'typeorm';
import { MatchParticipant } from '../../matches/entities/match-participant.entity';
import { PlayerRankSnapshot } from './play-rank-snapshot.entity';

@Entity('players')
export class Player {
    @PrimaryColumn({ type: 'varchar' })
    puuid: string;

    @Column()
    region: string;

    @Column({ nullable: true })
    gameName: string;

    @Column({ nullable: true })
    tagLine: string;

    @CreateDateColumn()
    createdAt: Date;

    @Column({ type: 'timestamp', nullable: true })
    lastCheckedAt: Date;

    @OneToMany(() => MatchParticipant, (participant) => participant.player)
    participants: MatchParticipant[];

    @OneToMany(() => PlayerRankSnapshot, (snapshot) => snapshot.player)
    rankSnapshots: PlayerRankSnapshot[];
}