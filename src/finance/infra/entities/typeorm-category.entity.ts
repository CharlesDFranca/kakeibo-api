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

@Entity('categories')
@Unique(['userId', 'name'])
export class CategoryEntity {
    @PrimaryColumn()
    id!: string;

    @Column({ type: 'varchar', length: 100 })
    name!: string;

    @Column()
    userId!: string;

    @Column({ type: 'boolean' })
    isSystem!: boolean;

    @ManyToOne(() => UserEntity, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'userId' })
    user!: UserEntity;

    @CreateDateColumn({ type: 'timestamptz' })
    createdAt!: Date;

    @UpdateDateColumn({ type: 'timestamptz' })
    updatedAt!: Date;
}
