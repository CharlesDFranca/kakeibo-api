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
import { UserEntity } from '../../../identity/infra/entities/typeorm-user.entity';

@Entity('categories')
@Unique(['userId', 'name'])
export class CategoryEntity {
    @PrimaryColumn()
    id!: string;

    @Column({ type: 'varchar', length: 100, unique: true })
    name!: string;

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
