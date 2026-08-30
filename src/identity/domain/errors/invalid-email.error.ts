import { ErrorCodes } from '@/shared/errors/error-codes';
import { DomainError } from '@/shared/errors/types/domain-error';

export class InvalidEmailError extends DomainError {
    readonly code = ErrorCodes.INVALID_EMAIL;

    constructor() {
        super('The email is invalid.');
    }
}
