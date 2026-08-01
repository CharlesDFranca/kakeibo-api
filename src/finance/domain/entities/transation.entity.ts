import { BaseEntity } from 'shared/domain/entities/base-entity.entity';
import { TransationType } from '../value-objects/transation-type.vo';
import { ETransationStatus } from '../enums/transation-status.enum';

type TransationProps = {
    description: string;
    amount: number;
    type: TransationType;
    date: Date;
    walletId: string;
    categoryId: string;
};

export class Transation extends BaseEntity<TransationProps> {
    constructor(
        id: string,
        props: TransationProps,
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

    public get type(): TransationType {
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

    public get status(): ETransationStatus {
        const now = new Date();

        return this.date.getTime() > now.getTime()
            ? ETransationStatus.PENDING
            : ETransationStatus.COMPLETED;
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
        return this.status === ETransationStatus.PENDING;
    }

    public isCompleted(): boolean {
        return this.status === ETransationStatus.COMPLETED;
    }
}
