import { ErrorCodes } from '@/shared/errors/error-codes';
import { DomainError } from '@/shared/errors/types/domain-error';

export class EntityCreatedAtCannotBeAfterUpdatedAtError extends DomainError {
    readonly code = ErrorCodes.ENTITY_CREATED_AT_CANNOT_BE_AFTER_UPDATED_AT;
    constructor() {
        super('Entity creation date cannot be after its update date.');
    }
}
