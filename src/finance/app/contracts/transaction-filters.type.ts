import { ETransactionType } from '@/finance/domain/enums/transaction-type.enum';

export type TransactionFilters = {
    categoryIds?: string[];
    walletIds?: string[];
    startDate?: Date;
    endDate?: Date;
    type?: ETransactionType;
};
