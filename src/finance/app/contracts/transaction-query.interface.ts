import { TransactionDetails } from './transaction-details.type';
import { TransactionFilters } from './transaction-filters.type';

export interface ITransactionQuery {
    findAllForUser(
        userId: string,
        filters?: TransactionFilters,
    ): Promise<TransactionDetails[]>;
}
