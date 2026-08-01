import { IWalletRepository } from '@/finance/domain/repositories/wallet-repository.interface';
import { IBaseUseCase } from '@/shared/app/contracts/base-usecase.contract';

type DeleteWalletInput = {
    id: string;
};

type DeleteWalletOutput = void;

export class DeleteWalletUseCase implements IBaseUseCase<
    DeleteWalletInput,
    DeleteWalletOutput
> {
    constructor(private readonly walletRepository: IWalletRepository) {}

    async execute(input: DeleteWalletInput): Promise<DeleteWalletOutput> {
        if (!input.id && input.id.trim() === '') {
            throw new Error('Error on delete.');
        }

        await this.walletRepository.delete(input.id);
    }
}
