import { EGoalMovementType } from '../enums/goal-movement-type.enum';

export class GoalMovementType {
    constructor(private readonly _value: EGoalMovementType) {}

    public get value(): EGoalMovementType {
        return this._value;
    }

    public isDeposit(): boolean {
        return this._value === EGoalMovementType.DEPOSIT;
    }

    public isWithdraw(): boolean {
        return this._value === EGoalMovementType.WITHDRAW;
    }
}
