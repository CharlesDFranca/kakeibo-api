import { Inject, Injectable } from '@nestjs/common';
import { ICategoryDeletionPolicy } from '@/finance/domain/services/category-deletion-policy.interface';
import { FINANCE_TOKENS } from '@/finance/finance.tokens';
import type { ITransactionRepository } from '@/finance/domain/repositories/transaction-repository.interface';

@Injectable()
export class CategoryDeletionPolicy implements ICategoryDeletionPolicy {
    constructor(
        @Inject(FINANCE_TOKENS.TRANSACTION_REPOSITORY)
        private readonly transactionRepository: ITransactionRepository,
    ) {}

    async canDelete(userId: string, categoryId: string): Promise<boolean> {
        const hasAssociatedTransactions =
            await this.transactionRepository.existsUserTransactionByCategoryId(
                userId,
                categoryId,
            );

        return !hasAssociatedTransactions;
    }
}
