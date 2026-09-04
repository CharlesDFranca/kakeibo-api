import { ErrorCodes } from '@/shared/errors/error-codes';
import { DomainError } from '@/shared/errors/types/domain-error';

export class TransferCannotBeRevertedError extends DomainError {
    readonly code = ErrorCodes.TRANSFER_CANNOT_BE_REVERTED;

    constructor() {
        super('The transfer cannot be reverted.');
    }
}
