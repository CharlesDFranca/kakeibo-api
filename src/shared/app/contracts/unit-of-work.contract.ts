import { ITransactionRepository } from '@/finance/transactions/domain/repositories/transaction-repository.interface';
import { IWalletRepository } from '@/finance/wallets/domain/repositories/wallet-repository.interface';
import { IGoalMovementRepository } from '@/planning/goals/domain/repositories/goal-movement-repository.interface';
import { IGoalRepository } from '@/planning/goals/domain/repositories/goal-repository.interface';

export interface IUnitOfWork {
    getWalletRepository(): IWalletRepository;
    getGoalRepository(): IGoalRepository;
    getTransactionRepository(): ITransactionRepository;
    getGoalMovementRepository(): IGoalMovementRepository;

    transaction<T>(work: () => Promise<T>): Promise<T>;
}
