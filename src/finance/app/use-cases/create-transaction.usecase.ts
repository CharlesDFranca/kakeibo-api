import { Transaction } from '@/finance/domain/entities/transaction.entity';
import type { ICategoryRepository } from '@/finance/domain/repositories/category-repository.interface';
import type { ITransactionRepository } from '@/finance/domain/repositories/transaction-repository.interface';
import type { IWalletRepository } from '@/finance/domain/repositories/wallet-repository.interface';
import { TransactionType } from '@/finance/domain/value-objects/transaction-type.vo';
import { FINANCE_TOKENS } from '@/finance/finance.tokens';
import { IBaseUseCase } from '@/shared/app/contracts/base-usecase.contract';
import type { IIDGenerator } from '@/shared/app/contracts/id-generator.contract';
import { SHARED_TOKENS } from '@/shared/shared.token';
import { Inject, Injectable } from '@nestjs/common';

type CreateTransactionInput = {
    description: string;
    amount: number;
    type: TransactionType;
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
        @Inject(SHARED_TOKENS.ID_GENERATOR)
        private readonly idGenerator: IIDGenerator,
    ) {}

    async execute(
        input: CreateTransactionInput,
    ): Promise<CreateTransactionOutput> {
        const category = await this.categoryRepository.findById(
            input.categoryId,
        );

        if (!category) throw new Error('Category not found');

        const wallet = await this.walletRepository.findById(input.walletId);

        if (!wallet) throw new Error('Wallet not found');

        const now = new Date();

        const transaction = new Transaction(
            this.idGenerator.generate(),
            {
                description: input.description,
                amount: input.amount,
                date: input.date,
                type: input.type,
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
