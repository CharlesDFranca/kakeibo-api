import { ErrorCodes } from '@/shared/errors/error-codes';

import { DomainError } from '@/shared/errors/types/domain-error';

export class WalletHasAllocatedMoneyError extends DomainError {
    readonly code = ErrorCodes.WALLET_HAS_ALLOCATED_MONEY;

    constructor() {
        super('Cannot delete wallet with allocated money.');
    }
}
