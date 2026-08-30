import { ErrorCodes } from '@/shared/errors/error-codes';
import { DomainError } from '@/shared/errors/types/domain-error';

export class InvalidTransactionDateError extends DomainError {
    readonly code = ErrorCodes.INVALID_TRANSACTION_DATE;

    constructor(date: Date) {
        super('The transaction date is invalid.', { date });
    }
}
