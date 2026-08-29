import { ErrorCodes } from '@/shared/errors/error-codes';
import { DomainError } from '@/shared/errors/types/domain-error';

export class GoalWithoutDeadlineCannotExpireError extends DomainError {
    readonly code = ErrorCodes.GOAL_WITHOUT_DEADLINE_CANNOT_EXPIRE;

    constructor() {
        super('A goal without a deadline cannot expire.');
    }
}
