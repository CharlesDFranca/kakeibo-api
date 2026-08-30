import { ErrorCodes } from '@/shared/errors/error-codes';
import { AppError } from '@/shared/errors/types/app-error';

export class UserNotFoundError extends AppError {
    readonly code = ErrorCodes.USER_NOT_FOUND;

    constructor() {
        super('User not found.');
    }
}
