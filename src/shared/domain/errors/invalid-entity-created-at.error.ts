import { ErrorCodes } from '@/shared/errors/error-codes';
import { DomainError } from '@/shared/errors/types/domain-error';

export class InvalidEntityCreatedAtError extends DomainError {
    readonly code = ErrorCodes.INVALID_ENTITY_CREATED_AT;
    constructor() {
        super('Entity creation date is invalid.');
    }
}
