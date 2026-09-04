import { FINANCE_TOKENS } from '@/finance/finance.tokens';
import { IBaseUseCase } from '@/shared/app/contracts/base-usecase.contract';
import { Inject, Injectable } from '@nestjs/common';
import type { ITransactionQuery } from '../../contracts/transaction-query.interface';
import { TransactionDetails } from '../../contracts/transaction-details.type';
import { TransactionFilters } from '../../contracts/transaction-filters.type';

type ListTransactionsInput = {
    userId: string;
    filters?: TransactionFilters;
};

type ListTransactionsOutput = TransactionDetails[];

@Injectable()
export class ListTransactionsUseCase implements IBaseUseCase<
    ListTransactionsInput,
    ListTransactionsOutput
> {
    constructor(
        @Inject(FINANCE_TOKENS.TRANSACTION_QUERY)
        private readonly transactionQuery: ITransactionQuery,
    ) {}

    async execute(
        input: ListTransactionsInput,
    ): Promise<ListTransactionsOutput> {
        return this.transactionQuery.findAllForUser(
            input.userId,
            input.filters,
        );
    }
}
