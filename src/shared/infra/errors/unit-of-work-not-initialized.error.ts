import { ErrorCodes } from '@/shared/errors/error-codes';
import { InfraError } from '@/shared/errors/types/infra-error';

export class UnitOfWorkNotInitializedError extends InfraError {
    readonly code = ErrorCodes.UNIT_OF_WORK_NOT_INITIALIZED;

    constructor() {
        super('Unit of work has not been initialized.');
    }
}
