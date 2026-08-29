export const ErrorCodes = {
    INVALID_TRANSACTION_DATE: 'INVALID_TRANSACTION_DATE',
    INSUFFICIENT_WALLET_BALANCE: 'INSUFFICIENT_WALLET_BALANCE',
} as const;

export type ErrorCode = (typeof ErrorCodes)[keyof typeof ErrorCodes];
