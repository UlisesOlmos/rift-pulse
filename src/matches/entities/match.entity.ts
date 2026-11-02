import {
  Entity,
  PrimaryColumn,
  Column,
  OneToMany,
} from 'typeorm';

import { MatchParticipant } from './match-participant.entity';

@Entity('matches')
export class Match {
  @PrimaryColumn()
  matchId: string;

  @Column()
  region: string;

  @Column({ type: 'timestamp' })
  gameCreation: Date;

  @Column()
  gameDuration: number;

  @Column()
  gameVersion: string;

  @Column()
  queueId: number;

  @Column({ nullable: true })
  gameMode: string;

  @OneToMany(() => MatchParticipant, (participant) => participant.match)
  participants: MatchParticipant[];
}