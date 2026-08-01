import { Transaction } from '@/finance/domain/entities/transaction.entity';
import { ICategoryRepository } from '@/finance/domain/repositories/category-repository.interface';
import { ITransactionRepository } from '@/finance/domain/repositories/transaction-repository.interface';
import { IWalletRepository } from '@/finance/domain/repositories/wallet-repository.interface';
import { TransactionType } from '@/finance/domain/value-objects/transaction-type.vo';
import { IBaseUseCase } from '@/shared/app/contracts/base-usecase.contract';
import { IIDGenerator } from '@/shared/app/contracts/id-generator.contract';

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

export class CreateTransactionUseCase implements IBaseUseCase<
    CreateTransactionInput,
    CreateTransactionOutput
> {
    constructor(
        private readonly transactionRepository: ITransactionRepository,
        private readonly walletRepository: IWalletRepository,
        private readonly categoryRepository: ICategoryRepository,
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
