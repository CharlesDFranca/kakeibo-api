import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryColumn,
    UpdateDateColumn,
} from 'typeorm';
import { EGoalStatus } from '@/planning/domain/enums/goal-status.enum';
import { UserEntity } from '@/identity/infra/entities/typeorm-user.entity';

@Entity('goals')
export class GoalEntity {
    @PrimaryColumn()
    id!: string;

    @Column({ type: 'varchar', length: 100 })
    name!: string;

    @Column()
    userId!: string;

    @ManyToOne(() => UserEntity, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'userId' })
    user!: UserEntity;

    @Column({ type: 'int' })
    targetAmount!: number;

    @Column({ type: 'int' })
    currentAmount!: number;

    @Column({ type: 'timestamptz', nullable: true })
    deadline!: Date | null;

    @Column({ type: 'enum', enum: EGoalStatus })
    status!: EGoalStatus;

    @CreateDateColumn({ type: 'timestamptz' })
    createdAt!: Date;

    @UpdateDateColumn({ type: 'timestamptz' })
    updatedAt!: Date;
}
