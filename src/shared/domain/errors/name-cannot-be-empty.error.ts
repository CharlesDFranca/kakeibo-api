import { ErrorCodes } from '@/shared/errors/error-codes';
import { DomainError } from '@/shared/errors/types/domain-error';

export class NameCannotBeEmptyError extends DomainError {
    readonly code = ErrorCodes.NAME_CANNOT_BE_EMPTY;

    constructor() {
        super('Name cannot be empty.');
    }
}
