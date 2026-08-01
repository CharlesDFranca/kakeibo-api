import { ETransactionType } from '../enums/transaction-type.enum';

export class TransactionType {
    constructor(private _value: ETransactionType) {}

    public value(): ETransactionType {
        return this._value;
    }

    public isIncome(): boolean {
        return this.value() === ETransactionType.INCOME;
    }

    public isExpense(): boolean {
        return this.value() === ETransactionType.EXPENSE;
    }

    public isTransfer(): boolean {
        return this.value() === ETransactionType.TRANSFER;
    }
}
