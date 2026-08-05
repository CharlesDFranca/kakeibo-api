import { Injectable } from '@nestjs/common';
import { ITransactionQuery } from '../../app/queries/transaction-query.interface';
import { TransactionDetails } from '../../app/types/transaction-details.type';
import { InjectRepository } from '@nestjs/typeorm';
import { TransactionEntity } from '@/shared/infra/database/entities/typeorm-transaction.entity';
import { Repository } from 'typeorm';
import { TypeOrmTransactionMapper } from '../mappers/typeorm-transaction.mapper';

@Injectable()
export class TypeOrmTransactionQuery implements ITransactionQuery {
    constructor(
        @InjectRepository(TransactionEntity)
        private readonly transactionRepository: Repository<TransactionEntity>,
        private readonly mapper: TypeOrmTransactionMapper,
    ) {}

    async findAllForUser(userId: string): Promise<TransactionDetails[]> {
        const transactions = await this.transactionRepository.find({
            where: {
                wallet: { userId },
                category: { userId },
            },
            relations: { category: true, wallet: true },
        });

        return transactions.map((t) => this.mapper.toDetails(t));
    }
}
