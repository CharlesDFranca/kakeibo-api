import { ErrorCodes } from '@/shared/errors/error-codes';
import { DomainError } from '@/shared/errors/types/domain-error';

export class CannotTransferToSameWalletError extends DomainError {
    readonly code = ErrorCodes.TRANSFER_SAME_WALLET;

    constructor() {
        super('Source and destination wallets must be different');
    }
}
