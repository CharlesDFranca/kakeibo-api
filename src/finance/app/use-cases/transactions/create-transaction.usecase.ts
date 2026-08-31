import { ETransactionType } from '@/finance/domain/enums/transaction-type.enum';
import { FINANCE_TOKENS } from '@/finance/finance.tokens';
import { IBaseUseCase } from '@/shared/app/contracts/base-usecase.contract';
import type { IIDGenerator } from '@/core/app/contracts/id-generator.contract';
import { Inject, Injectable } from '@nestjs/common';
import { Money } from '@/shared/domain/value-objects/money.vo';
import { CORE_TOKENS } from '@/core/core.tokens';
import { Transaction } from '@/finance/domain/entities/transaction.entity';
import { TransactionType } from '@/finance/domain/value-objects/transaction-type.vo';
import type { IFinanceUnitOfWork } from '../../contracts/finance-unit-of-work.contract';
import { CategoryNotFoundError } from '../../errors/category-not-found.error';
import { WalletNotFoundError } from '../../errors/wallet-not-found.error';

type CreateTransactionInput = {
    userId: string;
    description: string;
    amount: string;
    type: ETransactionType;
    date: Date;
    walletId: string;
    categoryId: string;
};

type CreateTransactionOutput = {
    id: string;
};

@Injectable()
export class CreateTransactionUseCase implements IBaseUseCase<
    CreateTransactionInput,
    CreateTransactionOutput
> {
    constructor(
        @Inject(CORE_TOKENS.ID_GENERATOR)
        private readonly idGenerator: IIDGenerator,
        @Inject(FINANCE_TOKENS.UNIT_OF_WORK)
        private readonly financeUow: IFinanceUnitOfWork,
    ) {}

    async execute(
        input: CreateTransactionInput,
    ): Promise<CreateTransactionOutput> {
        const transaction = await this.financeUow.transaction(async () => {
            const categoryRepository = this.financeUow.getCategoryRepository();
            const walletRepository = this.financeUow.getWalletRepository();
            const transactionRepository =
                this.financeUow.getTransactionRepository();

            const category = await categoryRepository.findUserCategoryById(
                input.userId,
                input.categoryId,
            );

            if (!category) throw new CategoryNotFoundError();

            const wallet = await walletRepository.findUserWalletById(
                input.userId,
                input.walletId,
            );

            if (!wallet) throw new WalletNotFoundError();

            const now = new Date();

            const transaction = new Transaction(
                this.idGenerator.generate(),
                {
                    description: input.description,
                    amount: Money.fromAmount(input.amount),
                    date: input.date,
                    type: new TransactionType(input.type),
                    categoryId: category.id,
                    walletId: wallet.id,
                },
                now,
                now,
            );

            if (transaction.isCompleted()) {
                if (transaction.isIncome()) {
                    wallet.deposit(transaction.amount);
                } else {
                    wallet.withdraw(transaction.amount);
                }
            }

            await transactionRepository.create(transaction);
            await walletRepository.update(wallet);

            return transaction;
        });

        return { id: transaction.id };
    }
}
