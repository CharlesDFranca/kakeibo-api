import { ETransactionType } from '@/finance/wallets/domain/enums/transaction-type.enum';
import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryColumn,
    UpdateDateColumn,
} from 'typeorm';
import { WalletEntity } from './typeorm-wallet.entity';
import { CategoryEntity } from './typeorm-category.entity';

@Entity('transactions')
export class TransactionEntity {
    @PrimaryColumn()
    id!: string;

    @Column({ type: 'varchar', length: 200 })
    description!: string;

    @Column({ type: 'int' })
    amount!: number;

    @Column({ type: 'enum', enum: ETransactionType })
    type!: ETransactionType;

    @Column({ type: 'timestamptz' })
    date!: Date;

    @Column()
    walletId!: string;

    @Column()
    categoryId!: string;

    @ManyToOne(() => WalletEntity, { onDelete: 'RESTRICT' })
    @JoinColumn({ name: 'walletId' })
    wallet!: WalletEntity;

    @ManyToOne(() => CategoryEntity, { onDelete: 'RESTRICT' })
    @JoinColumn({ name: 'categoryId' })
    category!: CategoryEntity;

    @CreateDateColumn({ type: 'timestamptz' })
    createdAt!: Date;

    @UpdateDateColumn({ type: 'timestamptz' })
    updatedAt!: Date;
}
