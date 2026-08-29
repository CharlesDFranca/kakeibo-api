import type { IWalletRepository } from '@/finance/domain/repositories/wallet-repository.interface';
import { FINANCE_TOKENS } from '@/finance/finance.tokens';
import { IBaseUseCase } from '@/shared/app/contracts/base-usecase.contract';
import { Name } from '@/shared/domain/value-objects/name.vo';
import { Inject, Injectable } from '@nestjs/common';

type RenameWalletInput = {
    walletId: string;
    name: string;
    userId: string;
};

type RenameWalletOutput = {
    walletId: string;
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
        const wallet = await this.walletRepository.findUserWalletById(
            input.userId,
            input.walletId,
        );

        if (!wallet) throw new Error('Wallet not found');

        const name = new Name(input.name);

        if (!wallet.name.equals(name)) {
            const walletWithSameName =
                await this.walletRepository.findUserWalletByName(
                    input.userId,
                    input.name,
                );

            if (walletWithSameName) {
                throw new Error('Wallet already exists with this name');
            }
        }

        wallet.rename(name);

        await this.walletRepository.update(wallet);

        return { walletId: wallet.id };
    }
}
