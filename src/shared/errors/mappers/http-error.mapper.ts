import { HttpException } from '@nestjs/common';
import { ApiError } from '../formatters/response-formatters';
import { AppError } from '../types/app-error';
import { DomainError } from '../types/domain-error';
import { InfraError } from '../types/infra-error';

export class HttpErrorMapper {
    static toApiError(error: unknown): ApiError {
        if (error instanceof HttpException) {
            return {
                code: `HTTP_${error.getStatus()}`,
                type: 'HTTP',
                message: error.message,
                details: undefined,
            };
        }

        if (error instanceof DomainError) {
            return {
                code: error.code,
                type: 'Domain',
                message: error.message,
                details: error.details,
            };
        }

        if (error instanceof AppError) {
            return {
                code: error.code,
                type: 'Application',
                message: error.message,
                details: error.details,
            };
        }

        if (error instanceof InfraError) {
            return {
                code: error.code,
                type: 'Infrastructure',
                message: error.message,
                details: error.details,
            };
        }

        return {
            code: 'INTERNAL_ERROR',
            type: 'Internal',
            message: 'Internal server error.',
        };
    }
}
