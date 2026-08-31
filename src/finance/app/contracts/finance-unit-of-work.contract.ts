import { ICategoryRepository } from '@/finance/domain/repositories/category-repository.interface';
import { ITransactionRepository } from '@/finance/domain/repositories/transaction-repository.interface';
import { ITransferRepository } from '@/finance/domain/repositories/transfer-repository.interface';
import { IWalletRepository } from '@/finance/domain/repositories/wallet-repository.interface';

export interface IFinanceUnitOfWork {
    transaction<T>(work: () => Promise<T>): Promise<T>;
    getWalletRepository(): IWalletRepository;
    getTransactionRepository(): ITransactionRepository;
    getCategoryRepository(): ICategoryRepository;
    getTransferRepository(): ITransferRepository;
}
