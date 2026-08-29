import { ApiResponse } from '@/shared/errors/formatters/response-formatters';
import {
    CallHandler,
    ExecutionContext,
    Injectable,
    NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<
    T,
    ApiResponse<T>
> {
    intercept(
        context: ExecutionContext,
        next: CallHandler<T>,
    ): Observable<ApiResponse<T>> {
        return next.handle().pipe(
            map((data) => ({
                success: true,
                data,
                meta: null,
                errors: null,
                message: 'Operation carried out successfully.',
            })),
        );
    }
}
