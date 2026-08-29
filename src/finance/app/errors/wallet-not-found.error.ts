import { ErrorCodes } from '@/shared/errors/error-codes';

import { AppError } from '@/shared/errors/types/app-error';

export class WalletNotFoundError extends AppError {
    readonly code = ErrorCodes.WALLET_NOT_FOUND;

    constructor() {
        super('Wallet not found.');
    }
}
