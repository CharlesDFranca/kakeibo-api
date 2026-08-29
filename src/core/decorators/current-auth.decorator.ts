import { AuthContext } from '@/identity/app/types/auth-context.type';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

export const CurrentAuth = createParamDecorator(
    (_, ctx: ExecutionContext): AuthContext => {
        const request = ctx.switchToHttp().getRequest<Request>();
        return request.auth;
    },
);
