import { Inject, Injectable } from '@nestjs/common';
import { AuthContext } from '../types/auth-context.type';
import type { ISessionRepository } from '@/identity/domain/repositories/session-repository.interface';
import { IDENTITY_TOKENS } from '@/identity/identity.token';
import { InvalidSessionError } from '../errors/invalid-session.error';
import type { IUserRepository } from '@/identity/domain/repositories/user-repository.interface';

@Injectable()
export class AuthContextService {
    constructor(
        @Inject(IDENTITY_TOKENS.SESSION_REPOSITORY)
        private readonly sessionRepository: ISessionRepository,
        @Inject(IDENTITY_TOKENS.USER_REPOSITORY)
        private readonly userRepository: IUserRepository,
    ) {}

    async resolve(sessionId: string): Promise<AuthContext> {
        const session = await this.sessionRepository.findById(sessionId);

        if (!session) {
            throw new InvalidSessionError();
        }

        const userExists = await this.userRepository.findById(session.userId);

        if (!userExists) {
            throw new InvalidSessionError();
        }

        return {
            sessionId: session.id,
            userId: session.userId,
        };
    }
}
