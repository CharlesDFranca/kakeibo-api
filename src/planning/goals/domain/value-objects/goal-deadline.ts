export class GoalDeadline {
    private constructor(private readonly value: Date) {}

    static create(deadline: Date, createdAt: Date): GoalDeadline {
        const minimumDeadline = createdAt.getTime() + 24 * 60 * 60 * 1000;

        if (deadline.getTime() < minimumDeadline) {
            throw new Error(
                'A deadline must have at least one day until it is due',
            );
        }

        return new GoalDeadline(deadline);
    }

    get date(): Date {
        return this.value;
    }

    isExpired(now = new Date()): boolean {
        return this.value.getTime() <= now.getTime();
    }
}
