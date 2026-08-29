import { ErrorCodes } from '@/shared/errors/error-codes';

import { AppError } from '@/shared/errors/types/app-error';

export class CategoryNotFoundError extends AppError {
    readonly code = ErrorCodes.CATEGORY_NOT_FOUND;

    constructor() {
        super('Category not found.');
    }
}
