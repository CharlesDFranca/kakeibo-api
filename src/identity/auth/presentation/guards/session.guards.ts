import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { AuthContextService } from '../../app/services/auth-context.service';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '../decorators/public-route.decorator';

@Injectable()
export class SessionGuard implements CanActivate {
    constructor(
        private readonly authContextService: AuthContextService,
        private readonly reflector: Reflector,
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const isPublic = this.reflector.getAllAndOverride<boolean>(
            IS_PUBLIC_KEY,
            [context.getHandler(), context.getClass()],
        );

        if (isPublic) return true;

        const request = context.switchToHttp().getRequest<Request>();

        const sessionId = request.cookies.session;

        if (!sessionId) throw new UnauthorizedException();

        request.auth = await this.authContextService.resolve(sessionId);

        return true;
    }
}
