import { Session } from '@/identity/domain/entities/session.entity';
import type { ISessionRepository } from '@/identity/domain/repositories/session-repository.interface';
import type { IUserRepository } from '@/identity/domain/repositories/user-repository.interface';
import { Email } from '@/identity/domain/value-objects/email.vo';
import { IDENTITY_TOKENS } from '@/identity/identity.token';
import { IBaseUseCase } from '@/shared/app/contracts/base-usecase.contract';
import type { IIDGenerator } from '@/shared/app/contracts/id-generator.contract';
import type { IPasswordHasher } from '@/shared/app/contracts/password-hasher.contract';
import { SHARED_TOKENS } from '@/shared/shared.token';
import { Injectable, Inject } from '@nestjs/common';

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
        @Inject(IDENTITY_TOKENS.SESSION_REPOSITORY)
        private readonly sessionRepository: ISessionRepository,
        @Inject(IDENTITY_TOKENS.USER_REPOSITORY)
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
