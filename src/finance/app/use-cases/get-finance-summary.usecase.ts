import type { ITransactionRepository } from '@/finance/transactions/domain/repositories/transaction-repository.interface';
import type { IWalletRepository } from '@/finance/wallets/domain/repositories/wallet-repository.interface';

import { FINANCE_TOKENS } from '@/finance/finance.tokens';

import { IBaseUseCase } from '@/shared/app/contracts/base-usecase.contract';
import { Money } from '@/shared/domain/value-objects/Money';

import { Inject, Injectable } from '@nestjs/common';

type GetFinanceSummaryInput = {
    userId: string;
};

type GetFinanceSummaryOutput = {
    balance: string;
    totalIncome: string;
    totalExpense: string;
};

@Injectable()
export class GetFinanceSummaryUseCase implements IBaseUseCase<
    GetFinanceSummaryInput,
    GetFinanceSummaryOutput
> {
    constructor(
        @Inject(FINANCE_TOKENS.WALLET_REPOSITORY)
        private readonly walletRepository: IWalletRepository,

        @Inject(FINANCE_TOKENS.TRANSACTION_REPOSITORY)
        private readonly transactionRepository: ITransactionRepository,
    ) {}

    async execute(
        input: GetFinanceSummaryInput,
    ): Promise<GetFinanceSummaryOutput> {
        const [wallets, transactions] = await Promise.all([
            this.walletRepository.findAllForUser(input.userId),
            this.transactionRepository.findAllForUser(input.userId),
        ]);

        const balance = wallets.reduce(
            (acc, wallet) => acc.add(wallet.balance),
            Money.zero(),
        );

        const { totalIncome, totalExpense } = transactions.reduce(
            (acc, transaction) => {
                if (!transaction.isCompleted()) {
                    return acc;
                }

                if (transaction.isIncome()) {
                    acc.totalIncome = acc.totalIncome.add(transaction.amount);
                }

                if (transaction.isExpense()) {
                    acc.totalExpense = acc.totalExpense.add(transaction.amount);
                }

                return acc;
            },
            {
                totalIncome: Money.zero(),
                totalExpense: Money.zero(),
            },
        );

        return {
            balance: balance.amount,
            totalIncome: totalIncome.amount,
            totalExpense: totalExpense.amount,
        };
    }
}
