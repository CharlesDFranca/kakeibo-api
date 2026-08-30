import { ErrorCodes } from '@/shared/errors/error-codes';
import { AppError } from '@/shared/errors/types/app-error';

export class EmailAlreadyExistsError extends AppError {
    readonly code = ErrorCodes.EMAIL_ALREADY_EXISTS;

    constructor() {
        super('An account with this email already exists.');
    }
}
