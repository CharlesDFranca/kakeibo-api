import { ErrorCodes } from '@/shared/errors/error-codes';
import { DomainError } from '@/shared/errors/types/domain-error';

export class GoalTargetAmountMustBeReachedError extends DomainError {

    readonly code = ErrorCodes.GOAL_TARGET_AMOUNT_MUST_BE_REACHED;

    constructor() {

        super('The goal target amount must be reached before completion.');

    }

}