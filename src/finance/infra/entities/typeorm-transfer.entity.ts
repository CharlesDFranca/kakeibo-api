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
import { TransactionEntity } from './typeorm-transaction.entity';

@Entity('transfers')
export class TransferEntity {
    @PrimaryColumn()
    id!: string;

    @Column({ type: 'int' })
    amount!: number;

    @Column()
    sourceWalletId!: string;

    @Column()
    destinationWalletId!: string;

    @Column()
    sourceTransactionId!: string;

    @Column()
    destinationTransactionId!: string;

    @CreateDateColumn({ type: 'timestamptz' })
    createdAt!: Date;

    @UpdateDateColumn({ type: 'timestamptz' })
    updatedAt!: Date;

    @ManyToOne(() => WalletEntity)
    @JoinColumn({ name: 'sourceWalletId' })
    sourceWallet!: WalletEntity;

    @ManyToOne(() => WalletEntity)
    @JoinColumn({ name: 'destinationWalletId' })
    destinationWallet!: WalletEntity;

    @ManyToOne(() => TransactionEntity)
    @JoinColumn({ name: 'sourceTransactionId' })
    sourceTransaction!: TransactionEntity;

    @ManyToOne(() => TransactionEntity)
    @JoinColumn({ name: 'destinationTransactionId' })
    destinationTransaction!: TransactionEntity;
}
