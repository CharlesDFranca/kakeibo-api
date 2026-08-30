import { ErrorCodes } from '@/shared/errors/error-codes';
import { AppError } from '@/shared/errors/types/app-error';

export class CategoryAlreadyExistsError extends AppError {
    readonly code = ErrorCodes.CATEGORY_ALREADY_EXISTS;

    constructor() {
        super('A category with this name already exists.');
    }
}
