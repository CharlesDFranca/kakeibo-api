import { IWalletRepository } from 'finance/domain/repositories/wallet-repository.interface';
import { IBaseUseCase } from 'shared/app/contracts/base-usecase.contract';

type RenameWalletInput = {
    id: string;
    name: string;
};

type RenameWalletOutput = {
    id: string;
};

export class RenameWalletUseCase implements IBaseUseCase<
    RenameWalletInput,
    RenameWalletOutput
> {
    constructor(private readonly walletRepository: IWalletRepository) {}

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
