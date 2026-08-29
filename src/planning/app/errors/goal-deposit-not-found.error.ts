import { ErrorCodes } from '@/shared/errors/error-codes';
import { AppError } from '@/shared/errors/types/app-error';

export class GoalDepositNotFoundError extends AppError {
    readonly code = ErrorCodes.GOAL_DEPOSIT_NOT_FOUND;

    constructor() {
        super('Goal deposit not found.');
    }
}
