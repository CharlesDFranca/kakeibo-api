import { BaseEntity } from '@/shared/domain/entities/base-entity.entity';
import { Money } from '@/shared/domain/value-objects/money.vo';
import { CannotTransferToSameWalletError } from '../errors/cannot-transfer-to-same-wallet.error';

type TransferProps = {
    amount: Money;
    sourceWalletId: string;
    destinationWalletId: string;
};

export class Transfer extends BaseEntity<TransferProps> {
    constructor(
        id: string,
        props: TransferProps,
        createdAt: Date,
        updatedAt: Date,
    ) {
        if (props.sourceWalletId === props.destinationWalletId) {
            throw new CannotTransferToSameWalletError();
        }

        super(id, props, createdAt, updatedAt);
    }

    public get amount(): Money {
        return this.props.amount;
    }

    public get sourceWalletId(): string {
        return this.props.sourceWalletId;
    }

    public get destinationWalletId(): string {
        return this.props.destinationWalletId;
    }
}
