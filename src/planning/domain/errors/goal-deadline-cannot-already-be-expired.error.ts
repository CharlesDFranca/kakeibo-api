import { ErrorCodes } from '@/shared/errors/error-codes';
import { DomainError } from '@/shared/errors/types/domain-error';

export class GoalDeadlineCannotAlreadyBeExpiredError extends DomainError {
    readonly code = ErrorCodes.GOAL_DEADLINE_CANNOT_ALREADY_BE_EXPIRED;

    constructor() {
        super('A goal deadline cannot already be expired.');
    }
}
