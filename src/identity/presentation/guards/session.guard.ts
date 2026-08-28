import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '../../../shared/decorators/public-route.decorator';
import { AuthContextService } from '@/identity/app/services/auth-context.service';

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
