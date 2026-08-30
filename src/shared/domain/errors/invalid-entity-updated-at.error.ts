import { ErrorCodes } from '@/shared/errors/error-codes';
import { DomainError } from '@/shared/errors/types/domain-error';

export class InvalidEntityUpdatedAtError extends DomainError {
    readonly code = ErrorCodes.INVALID_ENTITY_UPDATED_AT;
    constructor() {
        super('Entity update date is invalid.');
    }
}
