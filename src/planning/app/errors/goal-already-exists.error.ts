import { ErrorCodes } from '@/shared/errors/error-codes';
import { DomainError } from '@/shared/errors/types/domain-error';

export class GoalAlreadyExistsError extends DomainError {
    readonly code = ErrorCodes.GOAL_ALREADY_EXISTS;

    constructor() {
        super('A goal with this name already exists.');
    }
}
