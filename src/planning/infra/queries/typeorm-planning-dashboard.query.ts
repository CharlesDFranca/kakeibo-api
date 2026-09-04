import { EGoalStatus } from '@/planning/domain/enums/goal-status.enum';
import { IPlanningDashboardQuery } from '@/planning/app/contracts/planning-dashboard-query.interface';
import { PlanningDashboardDetails } from '@/planning/app/contracts/planning-dashboard-details.type';
import { Money } from '@/shared/domain/value-objects/money.vo';

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { GoalEntity } from '../entities/typeorm-goal.entity';

@Injectable()
export class TypeOrmPlanningDashboardQuery implements IPlanningDashboardQuery {
    constructor(
        @InjectRepository(GoalEntity)
        private readonly goalRepository: Repository<GoalEntity>,
    ) {}

    async findForDashboard(
        userId: string,
        limit: number,
    ): Promise<PlanningDashboardDetails[]> {
        const goals = await this.goalRepository
            .createQueryBuilder('goal')
            .select('goal.id', 'id')
            .addSelect('goal.name', 'name')
            .addSelect('goal.currentAmount', 'currentAmount')
            .addSelect('goal.targetAmount', 'targetAmount')
            .addSelect('goal.deadline', 'deadline')
            .where('goal.userId = :userId', {
                userId,
            })
            .andWhere('goal.status = :status', {
                status: EGoalStatus.IN_PROGRESS,
            })
            .orderBy('goal.deadline', 'ASC', 'NULLS LAST')
            .addOrderBy('goal.createdAt', 'ASC')
            .take(limit)
            .getRawMany<{
                id: string;
                name: string;
                currentAmount: string;
                targetAmount: string;
                deadline: Date | null;
            }>();

        return goals.map((goal) => {
            const currentAmount = Number(goal.currentAmount);
            const targetAmount = Number(goal.targetAmount);

            const percentage =
                targetAmount === 0
                    ? 0
                    : Math.min((currentAmount / targetAmount) * 100, 100);

            return {
                id: goal.id,
                name: goal.name,
                currentAmount: Money.fromCents(currentAmount),
                targetAmount: Money.fromCents(targetAmount),
                percentage,
                deadline: goal.deadline ? new Date(goal.deadline) : null,
            };
        });
    }
}
