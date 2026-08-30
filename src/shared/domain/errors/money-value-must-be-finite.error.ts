import { ErrorCodes } from '@/shared/errors/error-codes';
import { DomainError } from '@/shared/errors/types/domain-error';

export class MoneyValueMustBeFiniteError extends DomainError {
    readonly code = ErrorCodes.MONEY_VALUE_MUST_BE_FINITE;

    constructor() {
        super('Money value must be finite.');
    }
}
