import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GoalMovement } from '../../domain/entities/goal-movement.entity';
import { IGoalMovementRepository } from '../../domain/repositories/goal-movement-repository.interface';
import { GoalMovementEntity } from '@/shared/infra/database/entities/typeorm-goal-movement.entity';
import { TypeOrmGoalMovementMapper } from '../mappers/typeorm-goal-movement.mapper';

@Injectable()
export class TypeOrmGoalMovementRepository implements IGoalMovementRepository {
    constructor(
        @InjectRepository(GoalMovementEntity)
        private readonly goalMovementRepository: Repository<GoalMovementEntity>,
    ) {}

    async create(goalMovement: GoalMovement): Promise<void> {
        const entity = TypeOrmGoalMovementMapper.toPersistence(goalMovement);

        await this.goalMovementRepository.save(entity);
    }

    async findById(id: string): Promise<GoalMovement | null> {
        const goalMovement = await this.goalMovementRepository.findOne({
            where: { id },
        });

        if (!goalMovement) {
            return null;
        }

        return TypeOrmGoalMovementMapper.toDomain(goalMovement);
    }

    async findByGoalId(goalId: string): Promise<GoalMovement[]> {
        const goalMovements = await this.goalMovementRepository.find({
            where: { goalId },
        });

        return goalMovements.map((goalMovement) =>
            TypeOrmGoalMovementMapper.toDomain(goalMovement),
        );
    }

    async deleteByGoalId(goalId: string): Promise<void> {
        await this.goalMovementRepository.delete({ goalId });
    }
}
