import type { ITransactionRepository } from '@/finance/transactions/domain/repositories/transaction-repository.interface';
import type { IWalletRepository } from '@/finance/wallets/domain/repositories/wallet-repository.interface';
import { FINANCE_TOKENS } from '@/finance/finance.tokens';
import { IBaseUseCase } from '@/shared/app/contracts/base-usecase.contract';
import { Inject, Injectable } from '@nestjs/common';

type GetFinanceSummaryInput = void;

type GetFinanceSummaryOutput = {
    balance: number;
    totalIncome: number;
    totalExpense: number;
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

    async execute(input: void): Promise<GetFinanceSummaryOutput> {
        const [wallets, transactions] = await Promise.all([
            this.walletRepository.findAll(),
            this.transactionRepository.findAll(),
        ]);

        if (!wallets.length)
            return { balance: 0, totalIncome: 0, totalExpense: 0 };

        const balance = wallets.reduce((acc, w) => acc + w.balance, 0);

        const { totalIncome, totalExpense } = transactions.reduce(
            (acc, transaction) => {
                if (!transaction.isCompleted()) return acc;

                if (transaction.isIncome()) {
                    acc.totalIncome += transaction.amount;
                }

                if (transaction.isExpense()) {
                    acc.totalExpense += transaction.amount;
                }

                return acc;
            },
            { totalIncome: 0, totalExpense: 0 },
        );

        return { balance, totalIncome, totalExpense };
    }
}
