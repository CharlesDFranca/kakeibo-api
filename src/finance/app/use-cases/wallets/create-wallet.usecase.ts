import { Wallet } from '@/finance/domain/entities/wallet.entity';
import type { IWalletRepository } from '@/finance/domain/repositories/wallet-repository.interface';
import { FINANCE_TOKENS } from '@/finance/finance.tokens';
import { IBaseUseCase } from '@/shared/app/contracts/base-usecase.contract';
import type { IIDGenerator } from '@/shared/app/contracts/id-generator.contract';
import { SHARED_TOKENS } from '@/shared/shared.token';
import { Inject, Injectable } from '@nestjs/common';
import { Money } from '@/shared/domain/value-objects/Money';

type CreateWalletInput = {
    name: string;
    userId: string;
};

type CreateWalletOutput = {
    id: string;
};

@Injectable()
export class CreateWalletUseCase implements IBaseUseCase<
    CreateWalletInput,
    CreateWalletOutput
> {
    constructor(
        @Inject(FINANCE_TOKENS.WALLET_REPOSITORY)
        private readonly walletRepository: IWalletRepository,
        @Inject(SHARED_TOKENS.ID_GENERATOR)
        private readonly idGenerator: IIDGenerator,
    ) {}

    async execute(input: CreateWalletInput): Promise<CreateWalletOutput> {
        const existsByName = await this.walletRepository.findUserWalletByName(
            input.userId,
            input.name,
        );

        if (existsByName) {
            throw new Error('Wallet already exists with this name');
        }

        const now = new Date();

        const wallet = new Wallet(
            this.idGenerator.generate(),
            {
                name: input.name,
                balance: Money.zero(),
                userId: input.userId,
            },
            now,
            now,
        );

        await this.walletRepository.create(wallet);

        return { id: wallet.id };
    }
}
