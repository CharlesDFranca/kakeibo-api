import type { ITransactionRepository } from '@/finance/domain/repositories/transaction-repository.interface';
import { TransactionType } from '@/finance/domain/value-objects/transaction-type.vo';
import { FINANCE_TOKENS } from '@/finance/finance.tokens';
import { IBaseUseCase } from '@/shared/app/contracts/base-usecase.contract';
import { Inject, Injectable } from '@nestjs/common';

type ListTransactionsInput = void;

type ListTransactionsOutput = {
    id: string;
    description: string;
    amount: number;
    date: Date;
    type: TransactionType;

    category: {
        id: string;
        name: string;
    };

    wallet: {
        id: string;
        name: string;
    };
}[];

@Injectable()
export class ListTransactionsUseCase implements IBaseUseCase<
    ListTransactionsInput,
    ListTransactionsOutput
> {
    constructor(
        @Inject(FINANCE_TOKENS.TRANSACTION_REPOSITORY)
        private readonly transactionRepository: ITransactionRepository,
    ) {}

    async execute(input: void): Promise<ListTransactionsOutput> {
        const transactions =
            await this.transactionRepository.findAllWithCategoryAndWallet();

        return transactions.map((t) => ({
            id: t.id,
            description: t.description,
            amount: t.amount,
            date: t.date,
            type: t.type,

            category: {
                id: t.category.id,
                name: t.category.name,
            },

            wallet: {
                id: t.wallet.id,
                name: t.wallet.name,
            },
        }));
    }
}
