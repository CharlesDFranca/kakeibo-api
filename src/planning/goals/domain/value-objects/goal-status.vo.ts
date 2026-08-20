type Status = 'COMPLETED' | 'CANCELLED' | 'PAUSED' | 'IN PROGRESS' | 'EXPIRED';

export class GoalStatus {
    constructor(private readonly _value: Status) {}

    get value(): Status {
        return this._value;
    }

    public isCompleted(): boolean {
        return this.value === 'COMPLETED';
    }

    public isCancelled(): boolean {
        return this.value === 'CANCELLED';
    }

    public isInProgress(): boolean {
        return this.value === 'IN PROGRESS';
    }

    public isPaused(): boolean {
        return this.value === 'PAUSED';
    }

    public isExpired(): boolean {
        return this.value === 'EXPIRED';
    }
}
