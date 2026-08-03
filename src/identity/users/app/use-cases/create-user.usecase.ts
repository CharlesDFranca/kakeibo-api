import { IBaseUseCase } from "@/shared/app/contracts/base-usecase.contract";
import type { IIDGenerator } from "@/shared/app/contracts/id-generator.contract";
import type { IPasswordHasher } from "@/shared/app/contracts/password-hasher.contract";
import { SHARED_TOKENS } from "@/shared/shared.token";
import { Injectable, Inject } from "@nestjs/common";
import { User } from "../../domain/entities/user.entity";
import type { IUserRepository } from "../../domain/repositories/user-repository.interface";
import { Email } from "../../domain/value-objects/email.vo";
import { Username } from "../../domain/value-objects/username.vo";
import { USER_TOKENS } from "../../user.token";


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
        @Inject(USER_TOKENS.USER_REPOSITORY)
        private readonly userRepository: IUserRepository,
        @Inject(SHARED_TOKENS.PASSWORD_HASHER)
        private readonly passwordHasher: IPasswordHasher,
        @Inject(SHARED_TOKENS.ID_GENERATOR)
        private readonly idGenerator: IIDGenerator,
    ) {}

    async execute(input: CreateUserInput): Promise<CreateUserOutput> {
        const email = new Email(input.email);
        const username = new Username(input.username);

        const emailAlredyUsed = await this.userRepository.findByEmail(email);

        if (emailAlredyUsed) throw new Error('Email already exists');

        const usernameAlredyUsed =
            await this.userRepository.findByUsername(username);

        if (usernameAlredyUsed) throw new Error('Username already exists');

        const password = input.password.trim();

        if (!password.length) throw new Error('Password cannot be empty');

        const passwordHash = await this.passwordHasher.hash(password);

        const now = new Date();

        const user = new User(
            this.idGenerator.generate(),
            {
                name: input.name,
                username,
                email,
                passwordHash,
            },
            now,
            now,
        );

        await this.userRepository.create(user);

        return { id: user.id };
    }
}
