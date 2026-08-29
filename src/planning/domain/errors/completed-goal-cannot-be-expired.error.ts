import { ErrorCodes } from '@/shared/errors/error-codes';
import { DomainError } from '@/shared/errors/types/domain-error';

export class CompletedGoalCannotBeExpiredError extends DomainError {
    readonly code = ErrorCodes.COMPLETED_GOAL_CANNOT_BE_EXPIRED;

    constructor() {
        super('A completed goal cannot be expired.');
    }
}
