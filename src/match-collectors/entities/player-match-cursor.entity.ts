import {
    Entity,
    PrimaryColumn,
    Column,
    OneToOne,
    JoinColumn,
    UpdateDateColumn,
} from 'typeorm';

import { Player } from '../../players/entities/player.entity';

@Entity('player_match_cursors')
export class PlayerMatchCursor {

    @PrimaryColumn({ type: 'varchar' })
    puuid: string;

    @OneToOne(() => Player, {
        onDelete: 'CASCADE',
    })
    @JoinColumn({
        name: 'puuid',
        referencedColumnName: 'puuid',
    })
    player: Player;

    @Column({ type: 'varchar', nullable: true })
    lastMatchId: string | null;

    @Column({ type: 'integer', default: 0 })
    lastMatchStart: number;

    @Column({ type: 'timestamp', nullable: true })
    lastCollectedAt: Date | null;

    @Column({ default: false })
    initialBackfillCompleted: boolean;

    @Column({ type: 'integer', default: 0 })
    totalMatchesCollected: number;

    @Column({ type: 'text', nullable: true })
    lastError: string | null;

    @UpdateDateColumn()
    updatedAt: Date;
}