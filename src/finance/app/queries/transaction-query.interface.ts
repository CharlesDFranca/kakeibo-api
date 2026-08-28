import { TransactionDetails } from '../types/transaction-details.type';

export interface ITransactionQuery {
    findAllForUser(userId: string): Promise<TransactionDetails[]>;
}
