import { ErrorCodes } from '@/shared/errors/error-codes';
import { DomainError } from '@/shared/errors/types/domain-error';

export class ExpiredGoalCannotBeCompletedError extends DomainError {
    readonly code = ErrorCodes.EXPIRED_GOAL_CANNOT_BE_COMPLETED;

    constructor() {
        super('An expired goal cannot be completed.');
    }
}
