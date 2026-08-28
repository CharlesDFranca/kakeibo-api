import { Goal, GoalStatus, GoalDeadline } from '@/planning/domain';
import { Money } from '@/shared/domain/value-objects/Money';
import { GoalEntity } from '@/shared/infra/database/entities/typeorm-goal.entity';

export class TypeOrmGoalMapper {
    private constructor() {}

    public static toDomain(raw: GoalEntity): Goal {
        return new Goal(
            raw.id,
            {
                name: raw.name,
                currentAmount: Money.fromCents(raw.currentAmount),
                targetAmount: Money.fromCents(raw.targetAmount),
                status: new GoalStatus(raw.status),
                userId: raw.userId,
                deadline: raw.deadline
                    ? new GoalDeadline(raw.deadline, raw.createdAt)
                    : undefined,
            },
            raw.createdAt,
            raw.updatedAt,
        );
    }

    public static toPersistence(goal: Goal): GoalEntity {
        const entity = new GoalEntity();

        entity.id = goal.id;
        entity.name = goal.name;
        entity.userId = goal.userId;
        entity.targetAmount = goal.targetAmount.toCents();
        entity.currentAmount = goal.currentAmount.toCents();
        entity.deadline = goal.deadline ? goal.deadline.date : null;
        entity.status = goal.status.value;

        return entity;
    }
}
