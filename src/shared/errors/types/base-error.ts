import { ErrorCode } from '../error-codes';

type ErrorDetails = Record<string, unknown>;

export abstract class BaseError extends Error {
    abstract readonly code: ErrorCode;

    readonly details: ErrorDetails;

    constructor(message: string, detatils: ErrorDetails = {}) {
        super(message);

        this.name = new.target.name;
        this.details = detatils;

        Error.captureStackTrace?.(this, new.target);
    }
}
