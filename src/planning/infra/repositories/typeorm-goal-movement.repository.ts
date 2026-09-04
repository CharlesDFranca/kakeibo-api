import { GoalMovement } from '@/planning/domain/entities/goal-movement.entity';
import { EGoalMovementType } from '@/planning/domain/enums/goal-movement-type.enum';
import { IGoalMovementRepository } from '@/planning/domain/repositories/goal-movement-repository.interface';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GoalMovementEntity } from '../entities/typeorm-goal-movement.entity';
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

    async hasAllocatedAmountFromWallet(
        userId: string,
        walletId: string,
    ): Promise<boolean> {
        const result = await this.goalMovementRepository
            .createQueryBuilder('deposit')
            .innerJoin('deposit.wallet', 'wallet')
            .where('deposit.walletId = :walletId', {
                walletId,
            })
            .andWhere('wallet.userId = :userId', {
                userId,
            })
            .andWhere('deposit.type = :depositType', {
                depositType: EGoalMovementType.DEPOSIT,
            })
            .andWhere((qb) => {
                const subQuery = qb
                    .subQuery()
                    .select('1')
                    .from(GoalMovementEntity, 'withdraw')
                    .where('withdraw.revertedDepositId = deposit.id')
                    .andWhere('withdraw.type = :withdrawType')
                    .getQuery();

                return `NOT EXISTS ${subQuery}`;
            })
            .setParameter('withdrawType', EGoalMovementType.WITHDRAW)
            .getExists();

        return result;
    }
}
