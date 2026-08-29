export const ErrorCodes = {
    INVALID_TRANSACTION_DATE: 'INVALID_TRANSACTION_DATE',
} as const;

export type ErrorCode = (typeof ErrorCodes)[keyof typeof ErrorCodes];
