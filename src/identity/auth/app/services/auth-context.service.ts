import { Inject, Injectable } from '@nestjs/common';
import type { ISessionRepository } from '../../domain/repository/session-repository.interface';
import { AUTH_TOKENS } from '../../auth.token';
import { AuthContext } from '../types/auth-context.type';

@Injectable()
export class AuthContextService {
    constructor(
        @Inject(AUTH_TOKENS.SESSION_REPOSITORY)
        private readonly sessionRepository: ISessionRepository,
    ) {}

    async resolve(sessionId: string): Promise<AuthContext> {
        const session = await this.sessionRepository.findById(sessionId);

        if (!session) throw new Error('Unauthorazed');

        return {
            sessionId: session.id,
            userId: session.userId,
        };
    }
}
