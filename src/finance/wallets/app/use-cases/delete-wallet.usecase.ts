import type { IWalletRepository } from '@/finance/wallets/domain/repositories/wallet-repository.interface';
import { FINANCE_TOKENS } from '@/finance/finance.tokens';
import { IBaseUseCase } from '@/shared/app/contracts/base-usecase.contract';
import { Inject, Injectable } from '@nestjs/common';
import type { IWalletDeletionPolicy } from '../../domain/services/wallet-deletion-policy.interface';

type DeleteWalletInput = {
    walletId: string;
    userId: string;
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
        @Inject(FINANCE_TOKENS.ENSURE_CAN_DELETE_WALLET)
        private readonly walletDeletionPolicy: IWalletDeletionPolicy,
    ) {}

    async execute(input: DeleteWalletInput): Promise<DeleteWalletOutput> {
        if (!input.walletId || input.walletId.trim() === '') {
            throw new Error('Error on delete.');
        }

        await this.walletDeletionPolicy.ensureCanDelete(
            input.userId,
            input.walletId,
        );

        await this.walletRepository.deleteUserWallet(
            input.userId,
            input.walletId,
        );
    }
}
