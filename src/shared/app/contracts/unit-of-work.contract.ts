import { ITransactionRepository } from '@/finance/domain/repositories/transaction-repository.interface';
import { IWalletRepository } from '@/finance/domain/repositories/wallet-repository.interface';
import { IGoalMovementRepository } from '@/planning/domain/repositories/goal-movement-repository.interface';
import { IGoalRepository } from '@/planning/domain/repositories/goal-repository.interface';

export interface IUnitOfWork {
    getWalletRepository(): IWalletRepository;
    getGoalRepository(): IGoalRepository;
    getTransactionRepository(): ITransactionRepository;
    getGoalMovementRepository(): IGoalMovementRepository;

    transaction<T>(work: () => Promise<T>): Promise<T>;
}
