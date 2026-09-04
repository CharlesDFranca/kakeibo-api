import { ITransactionRepository } from '@/finance/domain/repositories/transaction-repository.interface';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmTransactionMapper } from '../mappers/typeorm-transaction.mapper';
import { TransactionEntity } from '@/finance/infra/entities/typeorm-transaction.entity';
import { Transaction } from '../../domain/entities/transaction.entity';

@Injectable()
export class TypeOrmTransactionRepository implements ITransactionRepository {
    constructor(
        @InjectRepository(TransactionEntity)
        private readonly transactionRepository: Repository<TransactionEntity>,
    ) {}

    async create(transaction: Transaction): Promise<void> {
        const entity = TypeOrmTransactionMapper.toPersistence(transaction);

        await this.transactionRepository.save(entity);
    }

    async update(transaction: Transaction): Promise<void> {
        const entity = TypeOrmTransactionMapper.toPersistence(transaction);

        await this.transactionRepository.save(entity);
    }

    async delete(id: string): Promise<void> {
        await this.transactionRepository.delete(id);
    }

    async findById(id: string): Promise<Transaction | null> {
        const transaction = await this.transactionRepository.findOne({
            where: { id },
        });

        if (!transaction) return null;

        return TypeOrmTransactionMapper.toDomain(transaction);
    }

    async findAll(): Promise<Transaction[]> {
        const transactions = await this.transactionRepository.find();

        return transactions.map((transaction) =>
            TypeOrmTransactionMapper.toDomain(transaction),
        );
    }

    async findAllForUser(userId: string): Promise<Transaction[]> {
        const transactions = await this.transactionRepository.find({
            where: { wallet: { userId } },
        });

        return transactions.map((transaction) =>
            TypeOrmTransactionMapper.toDomain(transaction),
        );
    }

    async existsUserTransactionByCategoryId(
        userId: string,
        categoryId: string,
    ): Promise<boolean> {
        return this.transactionRepository.exists({
            where: {
                category: {
                    id: categoryId,
                    userId,
                },
            },
        });
    }
}
