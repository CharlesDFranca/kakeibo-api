import { ETransactionType } from '../../domain/enums/transaction-type.enum';

export type TransactionDetails = {
    id: string;
    description: string;
    amount: number;
    date: Date;
    type: ETransactionType;

    category: {
        id: string;
        name: string;
    };

    wallet: {
        id: string;
        name: string;
    };
};
