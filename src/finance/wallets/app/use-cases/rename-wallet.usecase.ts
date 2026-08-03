import type { IWalletRepository } from '@/finance/wallets/domain/repositories/wallet-repository.interface';
import { FINANCE_TOKENS } from '@/finance/finance.tokens';
import { IBaseUseCase } from '@/shared/app/contracts/base-usecase.contract';
import { Inject, Injectable } from '@nestjs/common';

type RenameWalletInput = {
    id: string;
    name: string;
};

type RenameWalletOutput = {
    id: string;
};

@Injectable()
export class RenameWalletUseCase implements IBaseUseCase<
    RenameWalletInput,
    RenameWalletOutput
> {
    constructor(
        @Inject(FINANCE_TOKENS.WALLET_REPOSITORY)
        private readonly walletRepository: IWalletRepository,
    ) {}

    async execute(input: RenameWalletInput): Promise<RenameWalletOutput> {
        const wallet = await this.walletRepository.findById(input.id);

        if (!wallet) throw new Error('Wallet not found');

        if (wallet.name !== input.name) {
            const walletWithSameName = await this.walletRepository.findByName(
                input.name,
            );

            if (walletWithSameName) {
                throw new Error('Wallet already exists with this name');
            }
        }

        wallet.rename(input.name);

        await this.walletRepository.update(wallet);

        return { id: wallet.id };
    }
}
