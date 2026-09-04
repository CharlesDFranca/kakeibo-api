import { Transaction } from '../entities/transaction.entity';

export interface ITransactionRepository {
    create(transaction: Transaction): Promise<void>;
    update(transaction: Transaction): Promise<void>;
    delete(id: string): Promise<void>;
    findAllForUser(userId: string): Promise<Transaction[]>;
    existsUserTransactionByCategoryId(
        userId: string,
        categoryId: string,
    ): Promise<boolean>;
}
