import { TransactionDetails } from './transaction-details.type';

export type DashboardBalance = {
    current: string;
    income: string;
    expenses: string;
};

export type FinancialEvolution = {
    date: Date;
    income: string;
    expenses: string;
    balance: string;
};

export type ExpensesByCategory = {
    categoryId: string;
    categoryName: string;
    amount: string;
    percentage: number;
};

export type FinanceDashboardFilters = {
    startDate: Date;
    endDate: Date;
};

export type FinanceDashboardDetails = {
    balance: DashboardBalance;
    financialEvolution: FinancialEvolution[];
    expensesByCategory: ExpensesByCategory[];
    recentTransactions: TransactionDetails[];
};
