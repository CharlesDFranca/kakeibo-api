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

@Entity('contributions')
export class ContributionEntity {
    @PrimaryColumn()
    id!: string;

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

    @Column({ type: 'int' })
    amount!: number;

    @CreateDateColumn({ type: 'timestamptz' })
    createdAt!: Date;

    @UpdateDateColumn({ type: 'timestamptz' })
    updatedAt!: Date;
}
