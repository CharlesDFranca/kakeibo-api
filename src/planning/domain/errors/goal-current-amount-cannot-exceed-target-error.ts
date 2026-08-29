import { ErrorCodes } from '@/shared/errors/error-codes';
import { DomainError } from '@/shared/errors/types/domain-error';

export class GoalCurrentAmountCannotExceedTargetError extends DomainError {
    readonly code = ErrorCodes.GOAL_CURRENT_AMOUNT_CANNOT_EXCEED_TARGET;

    constructor() {
        super('Current amount cannot be greater than target amount.');
    }
}
