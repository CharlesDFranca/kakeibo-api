import type { IWalletRepository } from '@/finance/wallets/domain/repositories/wallet-repository.interface';
import { FINANCE_TOKENS } from '@/finance/finance.tokens';
import { IBaseUseCase } from '@/shared/app/contracts/base-usecase.contract';
import { Inject, Injectable } from '@nestjs/common';

type ListWalletsInput = void;

type ListWalletsOutput = {
    id: string;
    name: string;
    balance: number;
}[];

@Injectable()
export class ListWalletsUseCase implements IBaseUseCase<
    ListWalletsInput,
    ListWalletsOutput
> {
    constructor(
        @Inject(FINANCE_TOKENS.WALLET_REPOSITORY)
        private readonly walletRepository: IWalletRepository,
    ) {}

    async execute(input: void): Promise<ListWalletsOutput> {
        const wallets = await this.walletRepository.findAll();

        return wallets.map((w) => ({
            id: w.id,
            name: w.name,
            balance: w.balance,
        }));
    }
}
