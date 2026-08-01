import { BaseEntity } from 'shared/domain/entities/base-entity.entity';
import { TransactionType } from '../value-objects/transaction-type.vo';
import { ETransactionStatus } from '../enums/transaction-status.enum';

type TransactionProps = {
    description: string;
    amount: number;
    type: TransactionType;
    date: Date;
    walletId: string;
    categoryId: string;
};

export class Transaction extends BaseEntity<TransactionProps> {
    constructor(
        id: string,
        props: TransactionProps,
        createdAt: Date,
        updatedAt: Date,
    ) {
        super(id, props, createdAt, updatedAt);

        if (props.amount <= 0) {
            throw new Error('Invalid amount');
        }

        if (!this.isValidDate(props.date)) {
            throw new Error('Invalid transation date');
        }
    }

    //#region Getters
    public get description(): string {
        return this.props.description;
    }

    public get amount(): number {
        return this.props.amount;
    }

    public get type(): TransactionType {
        return this.props.type;
    }

    public get date(): Date {
        return this.props.date;
    }

    public get walletId(): string {
        return this.props.walletId;
    }

    public get categoryId(): string {
        return this.props.categoryId;
    }

    public get status(): ETransactionStatus {
        const now = new Date();

        return this.date.getTime() > now.getTime()
            ? ETransactionStatus.PENDING
            : ETransactionStatus.COMPLETED;
    }
    //#endregion

    public isIncome(): boolean {
        return this.type.isIncome();
    }

    public isExpense(): boolean {
        return this.type.isExpense();
    }

    public isTransfer(): boolean {
        return this.type.isTransfer();
    }

    public isPending(): boolean {
        return this.status === ETransactionStatus.PENDING;
    }

    public isCompleted(): boolean {
        return this.status === ETransactionStatus.COMPLETED;
    }
}
