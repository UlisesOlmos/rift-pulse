import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';

import { Player } from './player.entity';

@Entity('player_rank_snapshots')
export class PlayerRankSnapshot {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: string;

  @Column()
  puuid: string;

  @Column()
  queueType: string;

  @Column()
  tier: string;

  @Column({ nullable: true })
  division: string;

  @Column()
  leaguePoints: number;

  @Column()
  wins: number;

  @Column()
  losses: number;

  @CreateDateColumn()
  capturedAt: Date;

  @ManyToOne(() => Player, (player) => player.rankSnapshots)
  @JoinColumn({ name: 'puuid' })
  player: Player;
}