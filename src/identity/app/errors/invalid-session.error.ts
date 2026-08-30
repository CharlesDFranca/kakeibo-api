import { ErrorCodes } from '@/shared/errors/error-codes';
import { AppError } from '@/shared/errors/types/app-error';

export class InvalidSessionError extends AppError {
    readonly code = ErrorCodes.INVALID_SESSION;

    constructor() {
        super('Invalid session.');
    }
}
