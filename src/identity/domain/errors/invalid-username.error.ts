import { ErrorCodes } from '@/shared/errors/error-codes';
import { DomainError } from '@/shared/errors/types/domain-error';

export class InvalidUsernameError extends DomainError {
    readonly code = ErrorCodes.INVALID_USERNAME;

    constructor() {
        super('The username is invalid.');
    }
}
