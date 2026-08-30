import { ErrorCodes } from '@/shared/errors/error-codes';
import { AppError } from '@/shared/errors/types/app-error';

export class InvalidCredentialsError extends AppError {
    readonly code = ErrorCodes.INVALID_CREDENTIALS;

    constructor() {
        super('Invalid credentials.');
    }
}
