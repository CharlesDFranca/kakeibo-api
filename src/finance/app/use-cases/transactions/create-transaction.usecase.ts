import { ETransactionType } from '@/finance/domain/enums/transaction-type.enum';
import type { ITransactionRepository } from '@/finance/domain/repositories/transaction-repository.interface';
import type { IWalletRepository } from '@/finance/domain/repositories/wallet-repository.interface';
import { FINANCE_TOKENS } from '@/finance/finance.tokens';
import { IBaseUseCase } from '@/shared/app/contracts/base-usecase.contract';
import type { IIDGenerator } from '@/shared/app/contracts/id-generator.contract';
import { Inject, Injectable } from '@nestjs/common';
import { Transaction } from '../../../domain/entities/transaction.entity';
import { TransactionType } from '../../../domain/value-objects/transaction-type.vo';
import type { ICategoryRepository } from '@/finance/domain/repositories/category-repository.interface';
import { Money } from '@/shared/domain/value-objects/money.vo';
import { CategoryNotFoundError } from '../../errors/category-not-found.error';
import { WalletNotFoundError } from '../../errors/wallet-not-found.error';
import { CORE_TOKENS } from '@/core/core.tokens';

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
        @Inject(FINANCE_TOKENS.TRANSACTION_REPOSITORY)
        private readonly transactionRepository: ITransactionRepository,
        @Inject(FINANCE_TOKENS.WALLET_REPOSITORY)
        private readonly walletRepository: IWalletRepository,
        @Inject(FINANCE_TOKENS.CATEGORY_REPOSITORY)
        private readonly categoryRepository: ICategoryRepository,
        @Inject(CORE_TOKENS.ID_GENERATOR)
        private readonly idGenerator: IIDGenerator,
    ) {}

    async execute(
        input: CreateTransactionInput,
    ): Promise<CreateTransactionOutput> {
        const category = await this.categoryRepository.findUserCategoryById(
            input.userId,
            input.categoryId,
        );

        if (!category) throw new CategoryNotFoundError();

        const wallet = await this.walletRepository.findUserWalletById(
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

        await this.transactionRepository.create(transaction);
        await this.walletRepository.update(wallet);

        return { id: transaction.id };
    }
}
