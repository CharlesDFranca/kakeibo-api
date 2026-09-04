import { Injectable } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { ETransactionType } from '@/finance/domain/enums/transaction-type.enum';

import { IFinanceDashboardQuery } from '@/finance/app/contracts/finance-dashboard-query.interface';

import {
    DashboardBalance,
    FinanceDashboardFilters,
    FinancialEvolution,
    ExpensesByCategory,
} from '@/finance/app/contracts/finance-dashboard-details.type';

import { TransactionDetails } from '@/finance/app/contracts/transaction-details.type';

import { TransactionEntity } from '../entities/typeorm-transaction.entity';
import { WalletEntity } from '../entities/typeorm-wallet.entity';
import { TypeOrmTransactionMapper } from '../mappers/typeorm-transaction.mapper';

@Injectable()
export class TypeOrmFinanceDashboardQuery implements IFinanceDashboardQuery {
    constructor(
        @InjectRepository(TransactionEntity)
        private readonly transactionRepository: Repository<TransactionEntity>,

        @InjectRepository(WalletEntity)
        private readonly walletRepository: Repository<WalletEntity>,
    ) {}

    async getBalance(
        userId: string,
        filters?: FinanceDashboardFilters,
    ): Promise<DashboardBalance> {
        const balanceQuery = this.walletRepository
            .createQueryBuilder('wallet')
            .select('COALESCE(SUM(wallet.balance), 0)', 'balance')
            .where('wallet.userId = :userId', { userId });

        const incomeQuery = this.transactionRepository
            .createQueryBuilder('transaction')
            .innerJoin('transaction.wallet', 'wallet')
            .select('COALESCE(SUM(transaction.amount), 0)', 'income')
            .where('wallet.userId = :userId', { userId })
            .andWhere('transaction.type = :incomeType', {
                incomeType: ETransactionType.INCOME,
            });

        const expensesQuery = this.transactionRepository
            .createQueryBuilder('transaction')
            .innerJoin('transaction.wallet', 'wallet')
            .select('COALESCE(SUM(transaction.amount), 0)', 'expenses')
            .where('wallet.userId = :userId', { userId })
            .andWhere('transaction.type = :expenseType', {
                expenseType: ETransactionType.EXPENSE,
            });

        if (filters) {
            incomeQuery
                .andWhere('transaction.date >= :startDate', {
                    startDate: filters.startDate,
                })
                .andWhere('transaction.date < :endDate', {
                    endDate: filters.endDate,
                });

            expensesQuery
                .andWhere('transaction.date >= :startDate', {
                    startDate: filters.startDate,
                })
                .andWhere('transaction.date < :endDate', {
                    endDate: filters.endDate,
                });
        }

        const [balanceResult, incomeResult, expensesResult] = await Promise.all(
            [
                balanceQuery.getRawOne<{ balance: string }>(),
                incomeQuery.getRawOne<{ income: string }>(),
                expensesQuery.getRawOne<{ expenses: string }>(),
            ],
        );

        return {
            current: this.centsToAmount(balanceResult?.balance ?? '0'),
            income: this.centsToAmount(incomeResult?.income ?? '0'),
            expenses: this.centsToAmount(expensesResult?.expenses ?? '0'),
        };
    }

    async getFinancialEvolution(
        userId: string,
        filters?: FinanceDashboardFilters,
    ): Promise<FinancialEvolution[]> {
        const endDate = filters?.endDate ?? new Date();

        const startDate =
            filters?.startDate ??
            new Date(endDate.getFullYear(), endDate.getMonth() - 5, 1);

        const initialBalanceResult = await this.transactionRepository
            .createQueryBuilder('transaction')
            .innerJoin('transaction.wallet', 'wallet')
            .select(
                `
                        COALESCE(
                            SUM(
                                CASE
                                    WHEN transaction.type IN (:...incomeTypes)
                                        THEN transaction.amount

                                    WHEN transaction.type = :expenseType
                                        THEN -transaction.amount

                                    ELSE 0
                                END
                            ),
                            0
                        )
                    `,
                'balance',
            )
            .where('wallet.userId = :userId', { userId })
            .andWhere('transaction.date < :startDate', {
                startDate,
            })
            .setParameters({
                incomeTypes: [
                    ETransactionType.INCOME,
                    ETransactionType.OPENING_BALANCE,
                ],
                expenseType: ETransactionType.EXPENSE,
            })
            .getRawOne<{ balance: string }>();

        const result = await this.transactionRepository
            .createQueryBuilder('transaction')
            .innerJoin('transaction.wallet', 'wallet')
            .select("DATE_TRUNC('day', transaction.date)", 'date')
            .addSelect(
                `
                    COALESCE(
                        SUM(
                            CASE
                                WHEN transaction.type = :incomeType
                                    THEN transaction.amount
                                ELSE 0
                            END
                        ),
                        0
                    )
                `,
                'income',
            )
            .addSelect(
                `
                    COALESCE(
                        SUM(
                            CASE
                                WHEN transaction.type = :expenseType
                                    THEN transaction.amount
                                ELSE 0
                            END
                        ),
                        0
                    )
                `,
                'expenses',
            )
            .addSelect(
                `
                    COALESCE(
                        SUM(
                            CASE
                                WHEN transaction.type = :openingBalanceType
                                    THEN transaction.amount
                                ELSE 0
                            END
                        ),
                        0
                    )
                `,
                'openingBalance',
            )
            .where('wallet.userId = :userId', { userId })
            .andWhere('transaction.date >= :startDate', {
                startDate,
            })
            .andWhere('transaction.date < :endDate', {
                endDate,
            })
            .groupBy("DATE_TRUNC('day', transaction.date)")
            .orderBy("DATE_TRUNC('day', transaction.date)", 'ASC')
            .setParameters({
                incomeType: ETransactionType.INCOME,
                expenseType: ETransactionType.EXPENSE,
                openingBalanceType: ETransactionType.OPENING_BALANCE,
            })
            .getRawMany<{
                date: Date;
                income: string;
                expenses: string;
                openingBalance: string;
            }>();

        let balance = Number(initialBalanceResult?.balance ?? '0');

        return result.map((item) => {
            const income = Number(item.income);
            const expenses = Number(item.expenses);
            const openingBalance = Number(item.openingBalance);

            balance += openingBalance + income - expenses;

            return {
                date: new Date(item.date),
                income: this.centsToAmount(income),
                expenses: this.centsToAmount(expenses),
                balance: this.centsToAmount(balance),
            };
        });
    }

    async getExpensesByCategory(
        userId: string,
        filters?: FinanceDashboardFilters,
    ): Promise<ExpensesByCategory[]> {
        const query = this.transactionRepository
            .createQueryBuilder('transaction')
            .innerJoin('transaction.wallet', 'wallet')
            .innerJoin('transaction.category', 'category')
            .select('category.id', 'categoryId')
            .addSelect('category.name', 'categoryName')
            .addSelect('COALESCE(SUM(transaction.amount), 0)', 'amount')
            .where('wallet.userId = :userId', { userId })
            .andWhere('transaction.type = :type', {
                type: ETransactionType.EXPENSE,
            });

        if (filters) {
            query
                .andWhere('transaction.date >= :startDate', {
                    startDate: filters.startDate,
                })
                .andWhere('transaction.date < :endDate', {
                    endDate: filters.endDate,
                });
        }

        const result = await query
            .groupBy('category.id')
            .addGroupBy('category.name')
            .orderBy('amount', 'DESC')
            .getRawMany<{
                categoryId: string;
                categoryName: string;
                amount: string;
            }>();

        const totalExpenses = result.reduce(
            (total, item) => total + Number(item.amount),
            0,
        );

        return result.map((item) => {
            const amount = Number(item.amount);

            return {
                categoryId: item.categoryId,
                categoryName: item.categoryName,
                amount: this.centsToAmount(amount),
                percentage:
                    totalExpenses === 0 ? 0 : (amount / totalExpenses) * 100,
            };
        });
    }

    async getRecentTransactions(
        userId: string,
        limit: number,
    ): Promise<TransactionDetails[]> {
        const transactions = await this.transactionRepository
            .createQueryBuilder('transaction')
            .innerJoinAndSelect('transaction.wallet', 'wallet')
            .innerJoinAndSelect('transaction.category', 'category')
            .where('wallet.userId = :userId', { userId })
            .orderBy('transaction.date', 'DESC')
            .addOrderBy('transaction.id', 'DESC')
            .take(limit)
            .getMany();

        return transactions.map((transaction) =>
            TypeOrmTransactionMapper.toDetails(transaction),
        );
    }

    private centsToAmount(cents: string | number): string {
        return (Number(cents) / 100).toFixed(2);
    }
}
