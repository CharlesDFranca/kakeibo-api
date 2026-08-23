import { ITransactionRepository } from '@/finance/transactions/domain/repositories/transaction-repository.interface';
import { IWalletRepository } from '@/finance/wallets/domain/repositories/wallet-repository.interface';
import { IGoalRepository } from '@/planning/goals/domain/repositories/goal-repository.interface';

export interface IUnitOfWork {
    getWalletRepository(): IWalletRepository;
    getGoalRepository(): IGoalRepository;
    getTransactionRepository(): ITransactionRepository;

    transaction<T>(work: () => Promise<T>): Promise<T>;
}
