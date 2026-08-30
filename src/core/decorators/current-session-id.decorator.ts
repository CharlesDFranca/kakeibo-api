import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

export const CurrentSessionId = createParamDecorator(
    (_, ctx: ExecutionContext): string => {
        const request = ctx.switchToHttp().getRequest<Request>();
        return request.auth.sessionId;
    },
);
