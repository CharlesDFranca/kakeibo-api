import { ErrorCodes } from '@/shared/errors/error-codes';
import { DomainError } from '@/shared/errors/types/domain-error';

export class GoalDeadlineMustBeAtLeastOneDayAfterCreationError extends DomainError {
    readonly code =
        ErrorCodes.GOAL_DEADLINE_MUST_BE_AT_LEAST_ONE_DAY_AFTER_CREATION;

    constructor() {
        super('Goal deadline must be at least one day after creation.');
    }
}
