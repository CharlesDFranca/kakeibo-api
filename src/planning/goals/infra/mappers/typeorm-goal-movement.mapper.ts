import { GoalMovementEntity } from '@/shared/infra/database/entities/typeorm-goal-movement.entity';
import { GoalMovement } from '../../domain/entities/goal-movement.entity';
import { Money } from '@/shared/domain/value-objects/Money';
import { GoalMovementType } from '../../domain/value-objects/goal-movement-type.vo';

export class TypeOrmGoalMovementMapper {
    private constructor() {}

    public static toDomain(raw: GoalMovementEntity): GoalMovement {
        return new GoalMovement(
            raw.id,
            {
                walletId: raw.walletId,
                goalId: raw.goalId,
                amount: Money.fromCents(raw.amount),
                type: new GoalMovementType(raw.type),
            },
            raw.createdAt,
            raw.updatedAt,
        );
    }

    public static toPersistence(
        goalMovement: GoalMovement,
    ): GoalMovementEntity {
        const entity = new GoalMovementEntity();

        entity.id = goalMovement.id;
        entity.walletId = goalMovement.walletId;
        entity.goalId = goalMovement.goalId;
        entity.amount = goalMovement.amount.toCents();
        entity.type = goalMovement.type.value;

        return entity;
    }
}
