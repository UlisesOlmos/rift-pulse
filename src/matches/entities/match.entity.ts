import {
  Entity,
  PrimaryColumn,
  Column,
  OneToMany,
  CreateDateColumn,
} from 'typeorm';

import { MatchParticipant } from './match-participant.entity';
import { RiotRegionalRoute } from '../../riot/riot.interface';

@Entity('matches')
export class Match {

  @PrimaryColumn({ type: 'varchar' })
  matchId: string;

  @Column({
    type: 'enum',
    enum: RiotRegionalRoute,
  })
  region: RiotRegionalRoute;

  @Column({ type: 'bigint' })
  gameCreation: string;

  @Column({ type: 'bigint' })
  gameDuration: string;

  @Column()
  gameVersion: string;

  @Column()
  queueId: number;

  @Column({ nullable: true })
  gameMode: string;

  @OneToMany(
    () => MatchParticipant,
    (participant) => participant.match,
  )
  participants: MatchParticipant[];

  @CreateDateColumn()
  createdAt: Date;
}