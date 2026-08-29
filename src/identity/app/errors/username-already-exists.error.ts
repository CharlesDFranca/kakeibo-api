import { ErrorCodes } from '@/shared/errors/error-codes';
import { AppError } from '@/shared/errors/types/app-error';

export class UsernameAlreadyExistsError extends AppError {
    readonly code = ErrorCodes.USERNAME_ALREADY_EXISTS;

    constructor() {
        super('An account with this username already exists.');
    }
}
