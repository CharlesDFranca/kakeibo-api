export const ErrorCodes = {
    INVALID_TRANSACTION_DATE: 'INVALID_TRANSACTION_DATE',
    INSUFFICIENT_WALLET_BALANCE: 'INSUFFICIENT_WALLET_BALANCE',
    CATEGORY_ALREADY_EXISTS: 'CATEGORY_ALREADY_EXISTS',
} as const;

export type ErrorCode = (typeof ErrorCodes)[keyof typeof ErrorCodes];
