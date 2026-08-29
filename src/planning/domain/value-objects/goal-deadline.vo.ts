import { GoalDeadlineMustBeAtLeastOneDayAfterCreationError } from '../errors/goal-deadline-must-be-at-least-one-day-after-creation.error';

export class GoalDeadline {
    constructor(
        private readonly deadline: Date,
        private readonly createdAt: Date,
    ) {
        const minimumDeadline = createdAt.getTime() + 24 * 60 * 60 * 1000;

        if (deadline.getTime() < minimumDeadline) {
            throw new GoalDeadlineMustBeAtLeastOneDayAfterCreationError();
        }
    }

    public get date(): Date {
        return this.deadline;
    }

    public isExpired(now = new Date()): boolean {
        return this.deadline.getTime() <= now.getTime();
    }
}
