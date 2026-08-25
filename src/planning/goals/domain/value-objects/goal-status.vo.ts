import { EGoalStatus } from '../enums/goal-status.enum';

export class GoalStatus {
    constructor(private readonly _value: EGoalStatus) {}

    get value(): EGoalStatus {
        return this._value;
    }

    public isCompleted(): boolean {
        return this.value === 'COMPLETED';
    }

    public isInProgress(): boolean {
        return this.value === 'IN PROGRESS';
    }

    public isExpired(): boolean {
        return this.value === 'EXPIRED';
    }
}
