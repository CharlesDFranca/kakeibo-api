import { ErrorCodes } from '@/shared/errors/error-codes';
import { DomainError } from '@/shared/errors/types/domain-error';

export class GoalMovementCannotBeRevertedError extends DomainError {
    readonly code = ErrorCodes.GOAL_MOVEMENT_CANNOT_BE_REVERTED;

    constructor() {
        super('This goal movement cannot be reverted.');
    }
}
