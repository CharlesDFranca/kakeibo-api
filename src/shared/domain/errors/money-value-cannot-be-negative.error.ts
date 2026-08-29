import { ErrorCodes } from '@/shared/errors/error-codes';
import { DomainError } from '@/shared/errors/types/domain-error';

export class MoneyValueCannotBeNegativeError extends DomainError {
    readonly code = ErrorCodes.MONEY_VALUE_CANNOT_BE_NEGATIVE;

    constructor() {
        super('Money value cannot be negative.');
    }
}
