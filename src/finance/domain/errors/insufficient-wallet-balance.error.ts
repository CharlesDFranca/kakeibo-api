import { ErrorCodes } from '@/shared/errors/error-codes';
import { DomainError } from '@/shared/errors/types/domain-error';

export class InsufficientWalletBalanceError extends DomainError {
    readonly code = ErrorCodes.INSUFFICIENT_WALLET_BALANCE;

    constructor() {
        super('The wallet has insufficient balance for this withdrawal.');
    }
}
