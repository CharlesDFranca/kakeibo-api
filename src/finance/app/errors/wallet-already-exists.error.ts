import { ErrorCodes } from '@/shared/errors/error-codes';

import { AppError } from '@/shared/errors/types/app-error';

export class WalletAlreadyExistsError extends AppError {
    readonly code = ErrorCodes.WALLET_ALREADY_EXISTS;

    constructor() {
        super('A wallet with this name already exists.');
    }
}
