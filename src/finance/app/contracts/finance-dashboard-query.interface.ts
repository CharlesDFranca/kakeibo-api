import {
    DashboardBalance,
    FinancialEvolution,
    ExpensesByCategory,
    FinanceDashboardFilters,
} from './finance-dashboard-details.type';

import { TransactionDetails } from './transaction-details.type';
export interface IFinanceDashboardQuery {
    getBalance(
        userId: string,
        filters?: FinanceDashboardFilters,
    ): Promise<DashboardBalance>;

    getFinancialEvolution(
        userId: string,
        filters?: FinanceDashboardFilters,
    ): Promise<FinancialEvolution[]>;

    getExpensesByCategory(
        userId: string,
        filters?: FinanceDashboardFilters,
    ): Promise<ExpensesByCategory[]>;

    getRecentTransactions(
        userId: string,
        limit: number,
    ): Promise<TransactionDetails[]>;
}
