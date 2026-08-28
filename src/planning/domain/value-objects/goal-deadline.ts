export class GoalDeadline {
    constructor(
        private readonly deadline: Date,
        private readonly createdAt: Date,
    ) {
        const minimumDeadline = createdAt.getTime() + 24 * 60 * 60 * 1000;

        if (deadline.getTime() < minimumDeadline) {
            throw new Error(
                'A deadline must have at least one day until it is due',
            );
        }
    }

    public get date(): Date {
        return this.deadline;
    }

    public isExpired(now = new Date()): boolean {
        return this.deadline.getTime() <= now.getTime();
    }
}
