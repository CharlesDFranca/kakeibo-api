import { IWalletRepository } from 'finance/domain/repositories/wallet-repository.interface';
import { IBaseUseCase } from 'shared/app/contracts/base-usecase.contract';

type ListWalletsInput = void;

type ListWalletsOutput = {
    id: string;
    name: string;
    balance: number;
}[];

export class ListWalletsUseCase implements IBaseUseCase<
    ListWalletsInput,
    ListWalletsOutput
> {
    constructor(private readonly walletRepository: IWalletRepository) {}

    async execute(input: void): Promise<ListWalletsOutput> {
        const wallets = await this.walletRepository.findAll();

        return wallets.map((w) => ({
            id: w.id,
            name: w.name,
            balance: w.balance,
        }));
    }
}
