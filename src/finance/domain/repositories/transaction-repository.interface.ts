import { Transaction } from '../entities/transaction.entity';
import { TransactionType } from '../value-objects/transaction-type.vo';

export type TransactionDetails = {
    id: string;
    description: string;
    amount: string;
    date: Date;
    type: TransactionType;

    category: {
        id: string;
        name: string;
    };

    wallet: {
        id: string;
        name: string;
    };
};

export interface ITransactionRepository {
    create(transaction: Transaction): Promise<void>;
    update(transaction: Transaction): Promise<void>;
    delete(id: string): Promise<void>;
    findAllForUser(userId: string): Promise<Transaction[]>;
}
