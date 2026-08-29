import { ErrorCodes } from '@/shared/errors/error-codes';
import { DomainError } from '@/shared/errors/types/domain-error';

export class MoneyCannotHaveMoreThanTwoDecimalPlacesError extends DomainError {
    readonly code = ErrorCodes.MONEY_CANNOT_HAVE_MORE_THAN_TWO_DECIMAL_PLACES;

    constructor() {
        super('Money cannot have more than two decimal places.');
    }
}
