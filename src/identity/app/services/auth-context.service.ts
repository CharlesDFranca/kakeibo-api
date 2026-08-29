import { Inject, Injectable } from '@nestjs/common';
import { AuthContext } from '../types/auth-context.type';
import type { ISessionRepository } from '@/identity/domain/repositories/session-repository.interface';
import { IDENTITY_TOKENS } from '@/identity/identity.token';
import { InvalidSessionError } from '../errors/invalid-session.error';

@Injectable()
export class AuthContextService {
    constructor(
        @Inject(IDENTITY_TOKENS.SESSION_REPOSITORY)
        private readonly sessionRepository: ISessionRepository,
    ) {}

    async resolve(sessionId: string): Promise<AuthContext> {
        const session = await this.sessionRepository.findById(sessionId);

        if (!session) throw new InvalidSessionError();

        return {
            sessionId: session.id,
            userId: session.userId,
        };
    }
}
