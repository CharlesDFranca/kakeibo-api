import { ErrorCodes } from '@/shared/errors/error-codes';
import { AppError } from '@/shared/errors/types/app-error';

export class PasswordCannotBeEmptyError extends AppError {
    readonly code = ErrorCodes.PASSWORD_CANNOT_BE_EMPTY;

    constructor() {
        super('Password cannot be empty.');
    }
}
