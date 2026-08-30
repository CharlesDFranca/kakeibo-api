import { HttpErrorMapper } from '@/shared/errors/mappers/http-error.mapper';
import { HttpStatusCodeMapper } from '@/shared/errors/mappers/http-status-code.mapper';
import {
    Catch,
    ExceptionFilter,
    Logger,
    ArgumentsHost,
    HttpException,
} from '@nestjs/common';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
    private readonly logger = new Logger(GlobalExceptionFilter.name);

    catch(exception: unknown, host: ArgumentsHost): void {
        const response = host.switchToHttp().getResponse();

        this.logger.error(
            'Unhandled exception',
            exception instanceof Error ? exception.stack : String(exception),
        );

        const error = HttpErrorMapper.toApiError(exception);

        const statusCode =
            exception instanceof HttpException
                ? exception.getStatus()
                : HttpStatusCodeMapper.fromCode(error.code);

        response.status(statusCode).json({
            success: false,
            data: null,
            meta: null,
            errors: error,
            message: 'An error occurred during the operation.',
        });
    }
}
