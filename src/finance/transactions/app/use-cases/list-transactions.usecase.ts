import { FINANCE_TOKENS } from '@/finance/finance.tokens';
import { IBaseUseCase } from '@/shared/app/contracts/base-usecase.contract';
import { Inject, Injectable } from '@nestjs/common';
import type { ITransactionQuery } from '../queries/transaction-query.interface';
import { TransactionDetails } from '../types/transaction-details.type';

type ListTransactionsInput = { userId: string };

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
        return this.transactionQuery.findAllForUser(input.userId);
    }
}
