import { Transaction } from '../entities/transaction.entity';

export interface ITransactionRepository {
    create(transaction: Transaction): Promise<void>;
    update(transaction: Transaction): Promise<void>;
    delete(id: string): Promise<void>;
    findById(id: string): Promise<Transaction | null>;
    findAll(): Promise<Transaction[]>;
    existsById(id: string): Promise<boolean>;
}
