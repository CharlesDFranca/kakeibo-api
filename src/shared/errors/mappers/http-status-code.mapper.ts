import { HttpStatus } from '@nestjs/common';
import { ErrorCodes } from '@/shared/errors/error-codes';

export class HttpStatusCodeMapper {
    static fromCode(code: string): number {
        switch (code) {
            case ErrorCodes.INVALID_TRANSACTION_DATE:
            case ErrorCodes.INVALID_EMAIL:
            case ErrorCodes.INVALID_USERNAME:
            case ErrorCodes.PASSWORD_CANNOT_BE_EMPTY:
            case ErrorCodes.GOAL_MUST_BE_IN_PROGRESS:
            case ErrorCodes.INSUFFICIENT_GOAL_BALANCE:
            case ErrorCodes.EXPIRED_GOAL_CANNOT_BE_COMPLETED:
            case ErrorCodes.GOAL_TARGET_AMOUNT_MUST_BE_REACHED:
            case ErrorCodes.ONLY_EXPIRED_GOALS_CAN_BE_REACTIVATED:
            case ErrorCodes.COMPLETED_GOAL_CANNOT_BE_EXPIRED:
            case ErrorCodes.GOAL_WITHOUT_DEADLINE_CANNOT_EXPIRE:
            case ErrorCodes.GOAL_DEADLINE_MUST_BE_REACHED_BEFORE_EXPIRATION:
            case ErrorCodes.GOAL_CURRENT_AMOUNT_CANNOT_EXCEED_TARGET:
            case ErrorCodes.GOAL_DEADLINE_CANNOT_ALREADY_BE_EXPIRED:
            case ErrorCodes.GOAL_MOVEMENT_AMOUNT_MUST_BE_GREATER_THAN_ZERO:
            case ErrorCodes.MONEY_VALUE_CANNOT_BE_NEGATIVE:
            case ErrorCodes.MONEY_CANNOT_HAVE_MORE_THAN_TWO_DECIMAL_PLACES:
            case ErrorCodes.MONEY_VALUE_MUST_BE_FINITE:
            case ErrorCodes.INSUFFICIENT_WALLET_BALANCE:
            case ErrorCodes.NAME_CANNOT_BE_EMPTY:
            case ErrorCodes.NAME_CANNOT_EXCEED_MAXIMUM_LENGTH:
            case ErrorCodes.INVALID_ENUM_VALUE:
            case ErrorCodes.SESSION_EXPIRATION_MUST_BE_AFTER_CREATION:
                return HttpStatus.BAD_REQUEST;

            case ErrorCodes.INVALID_CREDENTIALS:
            case ErrorCodes.INVALID_SESSION:
                return HttpStatus.UNAUTHORIZED;

            case ErrorCodes.CATEGORY_NOT_FOUND:
            case ErrorCodes.WALLET_NOT_FOUND:
            case ErrorCodes.USER_NOT_FOUND:
            case ErrorCodes.GOAL_NOT_FOUND:
            case ErrorCodes.GOAL_DEPOSIT_NOT_FOUND:
                return HttpStatus.NOT_FOUND;

            case ErrorCodes.CATEGORY_ALREADY_EXISTS:
            case ErrorCodes.WALLET_ALREADY_EXISTS:
            case ErrorCodes.EMAIL_ALREADY_EXISTS:
            case ErrorCodes.USERNAME_ALREADY_EXISTS:
            case ErrorCodes.GOAL_ALREADY_EXISTS:
            case ErrorCodes.WALLET_HAS_ALLOCATED_MONEY:
            case ErrorCodes.GOAL_MOVEMENT_CANNOT_BE_REVERTED:
                return HttpStatus.CONFLICT;

            case ErrorCodes.GOAL_MOVEMENT_REFERENCES_NON_EXISTENT_WALLET:
            case ErrorCodes.UNIT_OF_WORK_NOT_INITIALIZED:
            default:
                return HttpStatus.INTERNAL_SERVER_ERROR;
        }
    }
}
