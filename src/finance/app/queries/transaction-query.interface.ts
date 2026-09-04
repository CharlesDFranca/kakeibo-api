import { TransactionDetails } from '../types/transaction-details.type';
import { TransactionFilters } from '../types/transaction-filters.type';

export interface ITransactionQuery {
    findAllForUser(
        userId: string,
        filters?: TransactionFilters,
    ): Promise<TransactionDetails[]>;
}
