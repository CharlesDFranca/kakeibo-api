import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { AuthContextService } from '../../app/services/auth-context.service';

@Injectable()
export class SessionGuard implements CanActivate {
    constructor(private readonly authContextService: AuthContextService) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest<Request>();

        const sessionId = request.cookies.session;

        if (!sessionId) throw new UnauthorizedException();

        request.auth = await this.authContextService.resolve(sessionId);

        return true;
    }
}
