import { UserEntity } from '@/identity/infra/entities/typeorm-user.entity';
import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryColumn,
    Unique,
    UpdateDateColumn,
} from 'typeorm';

@Entity('wallets')
@Unique(['userId', 'normalizedName'])
export class WalletEntity {
    @PrimaryColumn()
    id!: string;

    @Column({ type: 'varchar', length: 100 })
    name!: string;

    @Column({ type: 'varchar', length: 100 })
    normalizedName!: string;

    @Column({ type: 'int' })
    balance!: number;

    @Column()
    userId!: string;

    @ManyToOne(() => UserEntity, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'userId' })
    user!: UserEntity;

    @CreateDateColumn({ type: 'timestamptz' })
    createdAt!: Date;

    @UpdateDateColumn({ type: 'timestamptz' })
    updatedAt!: Date;
}
