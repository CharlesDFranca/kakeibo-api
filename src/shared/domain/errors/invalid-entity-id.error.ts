import { ErrorCodes } from '@/shared/errors/error-codes';
import { DomainError } from '@/shared/errors/types/domain-error';

export class InvalidEntityIdError extends DomainError {
    readonly code = ErrorCodes.INVALID_ENTITY_ID;

    constructor() {
        super('Entity ID cannot be empty.');
    }
}
