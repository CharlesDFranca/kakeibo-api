import { ErrorCodes } from '@/shared/errors/error-codes';
import { DomainError } from '@/shared/errors/types/domain-error';

export class InvalidDateRangeError extends DomainError {
    readonly code = ErrorCodes.INVALID_DATE_RANGE;

    constructor() {
        super('Start date must be before end date');
    }
}
