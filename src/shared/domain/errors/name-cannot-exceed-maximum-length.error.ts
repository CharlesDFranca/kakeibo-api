import { ErrorCodes } from '@/shared/errors/error-codes';
import { DomainError } from '@/shared/errors/types/domain-error';

export class NameCannotExceedMaximumLengthError extends DomainError {
    readonly code = ErrorCodes.NAME_CANNOT_EXCEED_MAXIMUM_LENGTH;

    constructor() {
        super('Name cannot exceed 100 characters.');
    }
}
