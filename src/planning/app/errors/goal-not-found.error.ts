import { ErrorCodes } from '@/shared/errors/error-codes';
import { AppError } from '@/shared/errors/types/app-error';

export class GoalNotFoundError extends AppError {
    readonly code = ErrorCodes.GOAL_NOT_FOUND;

    constructor() {
        super('Goal not found.');
    }
}
