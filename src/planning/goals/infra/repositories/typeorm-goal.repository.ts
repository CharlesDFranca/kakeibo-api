import { Injectable } from '@nestjs/common';
import { Goal } from '../../domain/entities/goal.entity';
import { IGoalRepository } from '../../domain/repositories/goal-repository.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { GoalEntity } from '@/shared/infra/database/entities/typeorm-goal.entity';
import { Repository } from 'typeorm';
import { TypeOrmGoalMapper } from '../mappers/typeorm-goal.mapper';

@Injectable()
export class TypeOrmGoalRepository implements IGoalRepository {
    constructor(
        @InjectRepository(GoalEntity)
        private readonly goalRepository: Repository<GoalEntity>,
    ) {}

    async create(goal: Goal): Promise<void> {
        const entity = TypeOrmGoalMapper.toPersistence(goal);
        await this.goalRepository.save(entity);
    }

    async update(goal: Goal): Promise<void> {
        const entity = TypeOrmGoalMapper.toPersistence(goal);
        await this.goalRepository.save(entity);
    }

    async findAllForUser(userId: string): Promise<Goal[]> {
        const goals = await this.goalRepository.find({ where: { userId } });

        return goals.map((goal) => TypeOrmGoalMapper.toDomain(goal));
    }

    async findUserGoalByName(
        userId: string,
        name: string,
    ): Promise<Goal | null> {
        const goal = await this.goalRepository.findOne({
            where: { name, userId },
        });

        if (!goal) return null;

        return TypeOrmGoalMapper.toDomain(goal);
    }

    async findUserGoalById(
        userId: string,
        goalId: string,
    ): Promise<Goal | null> {
        const goal = await this.goalRepository.findOne({
            where: { id: goalId, userId },
        });

        if (!goal) return null;

        return TypeOrmGoalMapper.toDomain(goal);
    }

    async deleteUserGoal(userId: string, goalId: string): Promise<void> {
        await this.goalRepository.delete({ id: goalId, userId });
    }
}
