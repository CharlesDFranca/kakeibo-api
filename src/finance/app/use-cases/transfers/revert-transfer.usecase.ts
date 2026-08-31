import type { IIDGenerator } from '@/core/app/contracts/id-generator.contract';
import { IBaseUseCase } from '@/shared/app/contracts/base-usecase.contract';
import { Inject, Injectable } from '@nestjs/common';
import type { IFinanceUnitOfWork } from '../../contracts/finance-unit-of-work.contract';
import { FINANCE_TOKENS } from '@/finance/finance.tokens';
import { CORE_TOKENS } from '@/core/core.tokens';
import { Transfer } from '@/finance/domain/entities/transfer.entity';
import { Money } from '@/shared/domain/value-objects/money.vo';
import { Transaction } from '@/finance/domain/entities/transaction.entity';
import { TransactionType } from '@/finance/domain/value-objects/transaction-type.vo';
import { ETransactionType } from '@/finance/domain/enums/transaction-type.enum';
import { CategoryNotFoundError } from '../../errors/category-not-found.error';
import { WalletNotFoundError } from '../../errors/wallet-not-found.error';
import { TransferNotFoundError } from '../../errors/transfer-not-found.error';
import { TransferCannotBeRevertedError } from '@/finance/domain/errors/transfer-cannot-be-reverted.error';

type RevertTransferInput = {
    userId: string;
    transferId: string;
    categoryId: string;
};

type RevertTransferOutput = void;

@Injectable()
export class RevertTransferUseCase implements IBaseUseCase<
    RevertTransferInput,
    RevertTransferOutput
> {
    constructor(
        @Inject(CORE_TOKENS.ID_GENERATOR)
        private readonly idGenerator: IIDGenerator,
        @Inject(FINANCE_TOKENS.UNIT_OF_WORK)
        private readonly financeUow: IFinanceUnitOfWork,
    ) {}

    async execute(input: RevertTransferInput): Promise<RevertTransferOutput> {
        await this.financeUow.transaction(async () => {
            const walletRepository = this.financeUow.getWalletRepository();
            const categoryRepository = this.financeUow.getCategoryRepository();
            const transferRepository = this.financeUow.getTransferRepository();
            const transactionRepository =
                this.financeUow.getTransactionRepository();

            const transfer = await transferRepository.findUserTransferById(
                input.userId,
                input.transferId,
            );

            if (!transfer) throw new TransferNotFoundError();

            if (!transfer.canRervert()) {
                throw new TransferCannotBeRevertedError();
            }

            const sourceWallet = await walletRepository.findUserWalletById(
                input.userId,
                transfer.destinationWalletId,
            );

            if (!sourceWallet) throw new WalletNotFoundError();

            const destinationWallet = await walletRepository.findUserWalletById(
                input.userId,
                transfer.sourceWalletId,
            );

            if (!destinationWallet) throw new WalletNotFoundError();

            const category = await categoryRepository.findUserCategoryById(
                input.userId,
                input.categoryId,
            );

            if (!category) throw new CategoryNotFoundError();

            const now = new Date();

            const sourceTransaction = new Transaction(
                this.idGenerator.generate(),
                {
                    amount: transfer.amount,
                    walletId: sourceWallet.id,
                    categoryId: category.id,
                    description: 'Transfer',
                    type: new TransactionType(ETransactionType.TRANSFER),
                    date: now,
                },
                now,
                now,
            );

            const destinationTransaction = new Transaction(
                this.idGenerator.generate(),
                {
                    amount: transfer.amount,
                    walletId: destinationWallet.id,
                    categoryId: category.id,
                    description: 'Transfer',
                    type: new TransactionType(ETransactionType.TRANSFER),
                    date: now,
                },
                now,
                now,
            );

            sourceWallet.withdraw(transfer.amount);
            destinationWallet.deposit(transfer.amount);
            transfer.revert();

            await walletRepository.update(sourceWallet);
            await walletRepository.update(destinationWallet);

            await transactionRepository.create(sourceTransaction);
            await transactionRepository.create(destinationTransaction);

            await transferRepository.update(transfer);

            return transfer;
        });
    }
}
