import { BaseTypeOrmUnitOfWork } from '@/core/infra/database/unit-of-work/base-typeorm-unit-of-work';
import { TransactionContext } from '@/core/infra/database/unit-of-work/transaction-context';
import { IPlanningUnitOfWork } from '@/planning/app/contracts/planning-unit-of-work.contract';
import { IGoalMovementRepository } from '@/planning/domain/repositories/goal-movement-repository.interface';
import { IGoalRepository } from '@/planning/domain/repositories/goal-repository.interface';
import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { GoalMovementEntity } from '../entities/typeorm-goal-movement.entity';
import { GoalEntity } from '../entities/typeorm-goal.entity';
import { TypeOrmGoalMovementRepository } from '../repositories/typeorm-goal-movement.repository';
import { TypeOrmGoalRepository } from '../repositories/typeorm-goal.repository';

@Injectable()
export class TypeOrmPlanningUnitOfWork
    extends BaseTypeOrmUnitOfWork
    implements IPlanningUnitOfWork
{
    constructor(dataSource: DataSource) {
        super(dataSource);
    }

    public getGoalRepository(): IGoalRepository {
        const manager = TransactionContext.getManager(this.dataSource.manager);
        return new TypeOrmGoalRepository(manager.getRepository(GoalEntity));
    }

    public getGoalMovementRepository(): IGoalMovementRepository {
        const manager = TransactionContext.getManager(this.dataSource.manager);
        return new TypeOrmGoalMovementRepository(
            manager.getRepository(GoalMovementEntity),
        );
    }
}
