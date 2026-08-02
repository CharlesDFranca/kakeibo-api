import type { IWalletRepository } from '@/finance/domain/repositories/wallet-repository.interface';
import { FINANCE_TOKENS } from '@/finance/finance.tokens';
import { IBaseUseCase } from '@/shared/app/contracts/base-usecase.contract';
import { Inject, Injectable } from '@nestjs/common';

type DeleteWalletInput = {
    id: string;
};

type DeleteWalletOutput = void;

@Injectable()
export class DeleteWalletUseCase implements IBaseUseCase<
    DeleteWalletInput,
    DeleteWalletOutput
> {
    constructor(
        @Inject(FINANCE_TOKENS.WALLET_REPOSITORY)
        private readonly walletRepository: IWalletRepository,
    ) {}

    async execute(input: DeleteWalletInput): Promise<DeleteWalletOutput> {
        if (!input.id && input.id.trim() === '') {
            throw new Error('Error on delete.');
        }

        await this.walletRepository.delete(input.id);
    }
}
