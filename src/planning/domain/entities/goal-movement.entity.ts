import { BaseEntity } from '@/shared/domain/entities/base-entity.entity';
import { Money } from '@/shared/domain/value-objects/money.vo';
import { GoalMovementType } from '../value-objects/goal-movement-type.vo';
import { GoalMovementAmountMustBeGreaterThanZeroError } from '../errors/goal-movement-amount-must-be-greater-than-zero.error';

type GoalMovementProps = {
    walletId: string;
    goalId: string;
    type: GoalMovementType;
    amount: Money;
    revertedDepositId?: string | undefined;
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
            throw new GoalMovementAmountMustBeGreaterThanZeroError();
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

    public get revertedDepositId(): string | undefined {
        return this.props.revertedDepositId;
    }

    public canRevert(): boolean {
        return this.isDeposit() && !this.revertedDepositId;
    }

    public isDeposit(): boolean {
        return this.type.isDeposit();
    }

    public isWithdraw(): boolean {
        return this.type.isWithdraw();
    }
}
