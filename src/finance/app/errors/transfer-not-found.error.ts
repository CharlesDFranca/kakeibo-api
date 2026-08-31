import { ErrorCodes } from '@/shared/errors/error-codes';
import { AppError } from '@/shared/errors/types/app-error';

export class TransferNotFoundError extends AppError {
    readonly code = ErrorCodes.TRANSFER_NOT_FOUND;

    constructor() {
        super('Transfer not found.');
    }
}