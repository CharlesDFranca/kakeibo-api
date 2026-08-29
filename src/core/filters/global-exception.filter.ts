import { HttpErrorMapper } from '@/shared/errors/mappers/http-error.mapper';
import { HttpStatusCodeMapper } from '@/shared/errors/mappers/http-status-code.mapper';
import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
    catch(exception: unknown, host: ArgumentsHost): void {
        const response = host.switchToHttp().getResponse();

        const error = HttpErrorMapper.toApiError(exception);

        const statusCode = HttpStatusCodeMapper.fromCode(error.code);

        response.status(statusCode).json({
            success: false,
            data: null,
            meta: null,
            errors: error,
            message: 'An error occurred during the operation.',
        });
    }
}
