import { Injectable } from '@nestjs/common';
import { ITransactionQuery } from '../../app/contracts/transaction-query.interface';
import { TransactionDetails } from '../../app/contracts/transaction-details.type';
import { InjectRepository } from '@nestjs/typeorm';
import { TransactionEntity } from '@/finance/infra/entities/typeorm-transaction.entity';
import { Repository } from 'typeorm';
import { TypeOrmTransactionMapper } from '../mappers/typeorm-transaction.mapper';
import { TransactionFilters } from '@/finance/app/contracts/transaction-filters.type';

@Injectable()
export class TypeOrmTransactionQuery implements ITransactionQuery {
    constructor(
        @InjectRepository(TransactionEntity)
        private readonly transactionRepository: Repository<TransactionEntity>,
    ) {}

    async findAllForUser(
        userId: string,
        filters?: TransactionFilters,
    ): Promise<TransactionDetails[]> {
        const query = this.transactionRepository
            .createQueryBuilder('transaction')
            .innerJoinAndSelect('transaction.wallet', 'wallet')
            .innerJoinAndSelect('transaction.category', 'category')
            .where('wallet.userId = :userId', { userId });

        if (filters?.categoryIds?.length) {
            query.andWhere('category.id IN (:...categoryIds)', {
                categoryIds: filters.categoryIds,
            });
        }

        if (filters?.walletIds?.length) {
            query.andWhere('wallet.id IN (:...walletIds)', {
                walletIds: filters.walletIds,
            });
        }

        if (filters?.startDate) {
            query.andWhere('transaction.date >= :startDate', {
                startDate: filters.startDate,
            });
        }

        if (filters?.endDate) {
            query.andWhere('transaction.date <= :endDate', {
                endDate: filters.endDate,
            });
        }

        if (filters?.type) {
            query.andWhere('transaction.type = :type', {
                type: filters.type,
            });
        }

        const transactions = await query
            .orderBy('transaction.date', 'DESC')
            .getMany();

        return transactions.map((transaction) =>
            TypeOrmTransactionMapper.toDetails(transaction),
        );
    }
}
