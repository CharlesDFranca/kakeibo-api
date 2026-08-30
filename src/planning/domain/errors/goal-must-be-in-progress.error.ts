import { ErrorCodes } from '@/shared/errors/error-codes';
import { DomainError } from '@/shared/errors/types/domain-error';

export class GoalMustBeInProgressError extends DomainError {
    readonly code = ErrorCodes.GOAL_MUST_BE_IN_PROGRESS;

    constructor() {
        super('Goal must be in progress.');
    }
}
