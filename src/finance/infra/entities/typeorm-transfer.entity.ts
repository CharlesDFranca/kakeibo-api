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
}
