import { ErrorCodes } from '@/shared/errors/error-codes';
import { DomainError } from '@/shared/errors/types/domain-error';

export class OnlyExpiredGoalsCanBeReactivatedError extends DomainError {
    readonly code = ErrorCodes.ONLY_EXPIRED_GOALS_CAN_BE_REACTIVATED;

    constructor() {
        super('Only expired goals can be reactivated.');
    }
}
