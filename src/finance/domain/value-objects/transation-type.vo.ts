import { ETransationType } from '../enums/transation-type.enum';

export class TransationType {
    constructor(private _value: ETransationType) {}

    public value(): ETransationType {
        return this._value;
    }

    public isIncome(): boolean {
        return this.value() === ETransationType.INCOME;
    }

    public isExpense(): boolean {
        return this.value() === ETransationType.EXPENSE;
    }

    public isTransfer(): boolean {
        return this.value() === ETransationType.TRANSFER;
    }
}
