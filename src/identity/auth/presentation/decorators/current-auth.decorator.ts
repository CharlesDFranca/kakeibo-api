import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { AuthContext } from '../../app/types/auth-context.type';

export const CurrentAuth = createParamDecorator(
    (_, ctx: ExecutionContext): AuthContext => {
        const request = ctx.switchToHttp().getRequest<Request>();
        return request.auth;
    },
);
