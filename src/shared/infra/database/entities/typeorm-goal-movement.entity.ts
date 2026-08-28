import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryColumn,
    UpdateDateColumn,
} from 'typeorm';

import { GoalEntity } from './typeorm-goal.entity';
import { WalletEntity } from './typeorm-wallet.entity';
import { EGoalMovementType } from '@/planning/goals/domain/enums/goal-movement-type.enum';

@Entity('goal_movements')
export class GoalMovementEntity {
    @PrimaryColumn()
    id!: string;

    @Column({ type: 'int' })
    amount!: number;

    @Column({ type: 'enum', enum: EGoalMovementType })
    type!: EGoalMovementType;

    @Column({ type: 'varchar', nullable: true })
    revertedDepositId!: string | null;

    @Column()
    walletId!: string;

    @ManyToOne(() => WalletEntity, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'walletId' })
    wallet!: WalletEntity;

    @Column()
    goalId!: string;

    @ManyToOne(() => GoalEntity, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'goalId' })
    goal!: GoalEntity;

    @CreateDateColumn({ type: 'timestamptz' })
    createdAt!: Date;

    @UpdateDateColumn({ type: 'timestamptz' })
    updatedAt!: Date;
}
