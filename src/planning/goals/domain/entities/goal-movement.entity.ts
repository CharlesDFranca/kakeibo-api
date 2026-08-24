import { BaseEntity } from '@/shared/domain/entities/base-entity.entity';
import { Money } from '@/shared/domain/value-objects/Money';
import { GoalMovementType } from '../value-objects/goal-movement-type.vo';

type GoalMovementProps = {
    walletId: string;
    goalId: string;
    type: GoalMovementType;
    amount: Money;
};

export class GoalMovement extends BaseEntity<GoalMovementProps> {
    constructor(
        id: string,
        props: GoalMovementProps,
        createdAt: Date,
        updatedAt: Date,
    ) {
        super(id, props, createdAt, updatedAt);

        if (props.amount.isZero()) {
            throw new Error('GoalMovement amount must be greater than zero');
        }
    }

    public get goalId(): string {
        return this.props.goalId;
    }

    public get walletId(): string {
        return this.props.walletId;
    }

    public get amount(): Money {
        return this.props.amount;
    }

    public get type(): GoalMovementType {
        return this.props.type;
    }

    public isDeposit(): boolean {
        return this.type.isDeposit();
    }

    public isWithdraw(): boolean {
        return this.type.isWithdraw();
    }
}
