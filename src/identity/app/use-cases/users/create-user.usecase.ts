import { User } from '@/identity/domain/entities/user.entity';
import type { IUserRepository } from '@/identity/domain/repositories/user-repository.interface';
import { Email } from '@/identity/domain/value-objects/email.vo';
import { Username } from '@/identity/domain/value-objects/username.vo';
import { IDENTITY_TOKENS } from '@/identity/identity.token';
import { IBaseUseCase } from '@/shared/app/contracts/base-usecase.contract';
import type { IIDGenerator } from '@/shared/app/contracts/id-generator.contract';
import type { IPasswordHasher } from '@/identity/app/contracts/password-hasher.contract';
import { Name } from '@/shared/domain/value-objects/name.vo';
import { Injectable, Inject } from '@nestjs/common';
import { EmailAlreadyExistsError } from '../../errors/email-already-exists.error';
import { UsernameAlreadyExistsError } from '../../errors/username-already-exists.error';
import { PasswordCannotBeEmptyError } from '../../errors/password-cannot-be-empty.error';
import { CORE_TOKENS } from '@/core/core.tokens';

type CreateUserInput = {
    name: string;
    username: string;
    email: string;
    password: string;
};
type CreateUserOutput = { id: string };

@Injectable()
export class CreateUserUseCase implements IBaseUseCase<
    CreateUserInput,
    CreateUserOutput
> {
    constructor(
        @Inject(IDENTITY_TOKENS.USER_REPOSITORY)
        private readonly userRepository: IUserRepository,
        @Inject(IDENTITY_TOKENS.PASSWORD_HASHER)
        private readonly passworder: IPasswordHasher,
        @Inject(CORE_TOKENS.ID_GENERATOR)
        private readonly idGenerator: IIDGenerator,
    ) {}

    async execute(input: CreateUserInput): Promise<CreateUserOutput> {
        const email = new Email(input.email);
        const username = new Username(input.username);

        const emailAlredyUsed = await this.userRepository.findByEmail(email);

        if (emailAlredyUsed) throw new EmailAlreadyExistsError();

        const usernameAlredyUsed =
            await this.userRepository.findByUsername(username);

        if (usernameAlredyUsed) throw new UsernameAlreadyExistsError();

        const password = input.password.trim();

        if (!password.length) throw new PasswordCannotBeEmptyError();

        const passwordHash = await this.passworder.hash(password);

        const now = new Date();

        const user = new User(
            this.idGenerator.generate(),
            {
                name: new Name(input.name),
                username,
                email,
                password: passwordHash,
            },
            now,
            now,
        );

        await this.userRepository.create(user);

        return { id: user.id };
    }
}
