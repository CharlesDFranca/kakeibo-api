import { Inject, Injectable } from '@nestjs/common';

import { FINANCE_TOKENS } from '@/finance/finance.tokens';

import {
    FinanceDashboardDetails,
    FinanceDashboardFilters,
} from '@/finance/app/types/finance-dashboard-details.type';
import type { IFinanceDashboardQuery } from '../../queries/finance-dashboard-query.interface';
import { InvalidDateRangeError } from '@/finance/app/errors/invalid-date-range.error';

type GetFinanceDashboardInput = {
    userId: string;
    startDate?: Date;
    endDate?: Date;
};

type GetFinanceDashboardOutput = FinanceDashboardDetails;

@Injectable()
export class GetFinanceDashboardUseCase {
    constructor(
        @Inject(FINANCE_TOKENS.FINANCE_DASHBOARD_QUERY)
        private readonly financeDashboardQuery: IFinanceDashboardQuery,
    ) {}

    async execute(
        input: GetFinanceDashboardInput,
    ): Promise<GetFinanceDashboardOutput> {
        if (
            (input.startDate && !input.endDate) ||
            (!input.startDate && input.endDate)
        ) {
            throw new InvalidDateRangeError();
        }

        if (
            input.startDate &&
            input.endDate &&
            input.startDate.getTime() >= input.endDate.getTime()
        ) {
            throw new InvalidDateRangeError();
        }

        const filters =
            input.startDate && input.endDate
                ? {
                      startDate: input.startDate,
                      endDate: input.endDate,
                  }
                : undefined;

        const [
            balance,
            financialEvolution,
            expensesByCategory,
            recentTransactions,
        ] = await Promise.all([
            this.financeDashboardQuery.getBalance(input.userId, filters),
            this.financeDashboardQuery.getFinancialEvolution(
                input.userId,
                filters,
            ),
            this.financeDashboardQuery.getExpensesByCategory(
                input.userId,
                filters,
            ),
            this.financeDashboardQuery.getRecentTransactions(input.userId, 5),
        ]);

        return {
            balance,
            financialEvolution,
            expensesByCategory,
            recentTransactions,
        };
    }
}
