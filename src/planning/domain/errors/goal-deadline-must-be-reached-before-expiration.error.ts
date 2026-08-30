import { ErrorCodes } from '@/shared/errors/error-codes';
import { DomainError } from '@/shared/errors/types/domain-error';

export class GoalDeadlineMustBeReachedBeforeExpirationError extends DomainError {
    readonly code = ErrorCodes.GOAL_DEADLINE_MUST_BE_REACHED_BEFORE_EXPIRATION;

    constructor() {
        super('The goal deadline has not been reached.');
    }
}
