import { IBaseUseCase } from '@/shared/app/contracts/base-usecase.contract';
import type { IUserRepository } from '@/users/domain/repositories/user-repository.interface';
import { USER_TOKENS } from '@/users/user.token';
import { Inject, Injectable } from '@nestjs/common';

type FindUserByIdInput = {
    id: string;
};

type FindUserByIdOutput = {
    id: string;
    name: string;
};

@Injectable()
export class FindUserByIdUseCase implements IBaseUseCase<
    FindUserByIdInput,
    FindUserByIdOutput
> {
    constructor(
        @Inject(USER_TOKENS.USER_REPOSITORY)
        private readonly userRepository: IUserRepository,
    ) {}

    async execute(input: FindUserByIdInput): Promise<FindUserByIdOutput> {
        const user = await this.userRepository.findById(input.id);

        if (!user) throw new Error('User not found');

        return { id: user.id, name: user.name };
    }
}
