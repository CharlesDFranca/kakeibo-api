import type { IUserRepository } from '@/identity/domain/repositories/user-repository.interface';
import { IDENTITY_TOKENS } from '@/identity/identity.token';
import { IBaseUseCase } from '@/shared/app/contracts/base-usecase.contract';
import { Injectable, Inject } from '@nestjs/common';
import { UserNotFoundError } from '../../errors/user-not-found.error';

type FindUserByIdInput = {
    id: string;
};

type FindUserByIdOutput = {
    id: string;
    name: string;
    username: string;
};

@Injectable()
export class FindUserByIdUseCase implements IBaseUseCase<
    FindUserByIdInput,
    FindUserByIdOutput
> {
    constructor(
        @Inject(IDENTITY_TOKENS.USER_REPOSITORY)
        private readonly userRepository: IUserRepository,
    ) {}

    async execute(input: FindUserByIdInput): Promise<FindUserByIdOutput> {
        const user = await this.userRepository.findById(input.id);

        if (!user) throw new UserNotFoundError();

        return {
            id: user.id,
            name: user.name.value,
            username: user.username.value,
        };
    }
}
