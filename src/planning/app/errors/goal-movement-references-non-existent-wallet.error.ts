import { ErrorCodes } from '@/shared/errors/error-codes';
import { AppError } from '@/shared/errors/types/app-error';

export class GoalMovementReferencesNonExistentWalletError extends AppError {
    readonly code = ErrorCodes.GOAL_MOVEMENT_REFERENCES_NON_EXISTENT_WALLET;

    constructor() {
        super('A goal movement references a non-existent wallet.');
    }
}
