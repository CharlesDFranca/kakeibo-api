export type ApiErrorType =
    | 'Validation'
    | 'Domain'
    | 'Application'
    | 'Infrastructure'
    | 'Internal'
    | 'HTTP';

export type ApiError = {
    code: string;
    type: ApiErrorType;
    message: string;
    details?: Record<string, unknown>;
};

export type ApiErrorResponse = {
    success: false;
    data: null;
    meta: Record<string, unknown> | null;
    errors: ApiError;
    message: string;
};

export type ApiSuccessResponse<T> = {
    success: true;
    data: T;
    meta: Record<string, unknown> | null;
    errors: null;
    message: string;
};

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;
