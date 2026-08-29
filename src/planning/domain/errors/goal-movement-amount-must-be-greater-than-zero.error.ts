import { ErrorCodes } from '@/shared/errors/error-codes';

import { DomainError } from '@/shared/errors/types/domain-error';

export class GoalMovementAmountMustBeGreaterThanZeroError extends DomainError {
    readonly code = ErrorCodes.GOAL_MOVEMENT_AMOUNT_MUST_BE_GREATER_THAN_ZERO;

    constructor() {
        super('Goal movement amount must be greater than zero.');
    }
}
