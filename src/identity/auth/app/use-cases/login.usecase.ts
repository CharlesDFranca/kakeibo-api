import { IBaseUseCase } from '@/shared/app/contracts/base-usecase.contract';
import { Inject, Injectable } from '@nestjs/common';
import type { ISessionRepository } from '../../domain/repository/session-repository.interface';
import type { IUserRepository } from '@/identity/users/domain/repositories/user-repository.interface';
import { AUTH_TOKENS } from '../../auth.token';
import { USER_TOKENS } from '@/identity/users/user.token';
import type { IIDGenerator } from '@/shared/app/contracts/id-generator.contract';
import { SHARED_TOKENS } from '@/shared/shared.token';
import type { IPasswordHasher } from '@/shared/app/contracts/password-hasher.contract';
import { Email } from '@/identity/users/domain/value-objects/email.vo';
import { Session } from '../../domain/entities/session.entity';

type LoginInput = {
    email: string;
    password: string;
};

type LoginOutput = {
    sessionId: string;
};

@Injectable()
export class LoginUseCase implements IBaseUseCase<LoginInput, LoginOutput> {
    constructor(
        @Inject(AUTH_TOKENS.SESSION_REPOSITORY)
        private readonly sessionRepository: ISessionRepository,
        @Inject(USER_TOKENS.USER_REPOSITORY)
        private readonly userRepository: IUserRepository,
        @Inject(SHARED_TOKENS.ID_GENERATOR)
        private readonly idGenerator: IIDGenerator,
        @Inject(SHARED_TOKENS.PASSWORD_HASHER)
        private readonly passwordHasher: IPasswordHasher,
    ) {}

    async execute(input: LoginInput): Promise<LoginOutput> {
        const user = await this.userRepository.findByEmail(
            new Email(input.email),
        );

        if (!user) throw new Error('User not found');

        const passwordMatch = await this.passwordHasher.compare(
            input.password,
            user.passwordHash,
        );

        if (!passwordMatch) throw new Error('Invalid credentials');

        const SESSION_DURATION_MS = 1000 * 60 * 60 * 24 * 30;

        const expiresAt = new Date(Date.now() + SESSION_DURATION_MS);

        const session = new Session(
            this.idGenerator.generate(),
            user.id,
            expiresAt,
        );

        await this.sessionRepository.save(session);
        
        return { sessionId: session.id };
    }
}
