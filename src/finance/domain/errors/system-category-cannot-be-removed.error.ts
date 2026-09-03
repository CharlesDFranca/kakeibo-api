import { ErrorCodes } from '@/shared/errors/error-codes';
import { DomainError } from '@/shared/errors/types/domain-error';

export class SystemCategoryCannotBeRemovedError extends DomainError {
    readonly code = ErrorCodes.SYSTEM_CATEGORY_CANNOT_BE_DELETED;

    constructor() {
        super('System categories cannot be removed');
    }
}
