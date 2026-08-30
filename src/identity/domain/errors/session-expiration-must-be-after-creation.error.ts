import { ErrorCodes } from '@/shared/errors/error-codes';

import { DomainError } from '@/shared/errors/types/domain-error';

export class SessionExpirationMustBeAfterCreationError extends DomainError {
    readonly code = ErrorCodes.SESSION_EXPIRATION_MUST_BE_AFTER_CREATION;

    constructor() {
        super('Session expiration must be after creation.');
    }
}
