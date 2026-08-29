import { ErrorCodes } from '@/shared/errors/error-codes';
import { DomainError } from '@/shared/errors/types/domain-error';

export class InvalidEnumValueError extends DomainError {
    readonly code = ErrorCodes.INVALID_ENUM_VALUE;

    constructor(value: string) {
        super(`Invalid enum value: ${value}.`);
    }
}
