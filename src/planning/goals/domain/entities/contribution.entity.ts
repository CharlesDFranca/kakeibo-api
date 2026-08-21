import { BaseEntity } from '@/shared/domain/entities/base-entity.entity';
import { Money } from '@/shared/domain/value-objects/Money';

type ContributionProps = {
    walletId: string;
    goalId: string;
    amount: Money;
};

export class Contribution extends BaseEntity<ContributionProps> {
    constructor(
        id: string,
        props: ContributionProps,
        createdAt: Date,
        updatedAt: Date,
    ) {
        super(id, props, createdAt, updatedAt);

        if (props.amount.isZero()) {
            throw new Error('Contribution amount must be greater than zero');
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
}
