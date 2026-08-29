import { ErrorCodes } from '@/shared/errors/error-codes';
import { DomainError } from '@/shared/errors/types/domain-error';

export class InvalidEntityPropsError extends DomainError {
    readonly code = ErrorCodes.INVALID_ENTITY_PROPS;

    constructor() {
        super('Entity properties cannot be empty.');
    }
}
