import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

import {
  RiotRegion,
  RiotTier,
  RiotRank,
} from '../../riot/riot.interface';

@Entity('collection_cursors')
export class CollectionCursor {

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: RiotRegion,
  })
  region: RiotRegion;

  @Column({
    type: 'enum',
    enum: RiotTier,
  })
  tier: RiotTier;

  @Column({
    type: 'enum',
    enum: RiotRank,
  })
  division: RiotRank;

  @Column({
    default: 1,
  })
  lastPage: number;

  @Column({
    default: 0,
  })
  totalPlayers: number;

  @Column({
    default: false,
  })
  completed: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}