import { ErrorCodes } from '@/shared/errors/error-codes';
import { DomainError } from '@/shared/errors/types/domain-error';

export class InsufficientGoalBalanceError extends DomainError {
    readonly code = ErrorCodes.INSUFFICIENT_GOAL_BALANCE;

    constructor() {
        super('The goal has insufficient balance for this withdrawal.');
    }
}
