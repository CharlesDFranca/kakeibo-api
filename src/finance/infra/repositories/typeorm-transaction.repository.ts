import { TransactionEntity } from '@/shared/database/entities/typeorm-transaction.entity';
import { Transaction } from '@/finance/domain/entities/transaction.entity';
import {
    ITransactionRepository,
    TransactionDetails,
} from '@/finance/domain/repositories/transaction-repository.interface';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmTransactionMapper } from '../mappers/typeorm-transaction.mapper';
import { TransactionType } from '@/finance/domain/value-objects/transaction-type.vo';

@Injectable()
export class TypeOrmTransactionRepository implements ITransactionRepository {
    constructor(
        @InjectRepository(TransactionEntity)
        private readonly transactionRepository: Repository<TransactionEntity>,
        private readonly mapper: TypeOrmTransactionMapper,
    ) {}

    async create(transaction: Transaction): Promise<void> {
        const entity = this.mapper.toPersistence(transaction);

        await this.transactionRepository.save(entity);
    }

    async update(transaction: Transaction): Promise<void> {
        const entity = this.mapper.toPersistence(transaction);

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

        return this.mapper.toDomain(transaction);
    }

    async findAll(): Promise<Transaction[]> {
        const transactions = await this.transactionRepository.find();

        return transactions.map((transaction) =>
            this.mapper.toDomain(transaction),
        );
    }

    async findAllWithCategoryAndWallet(): Promise<TransactionDetails[]> {
        const transactions = await this.transactionRepository.find({
            relations: { wallet: true, category: true },
        });

        return transactions.map((transaction) => ({
            id: transaction.id,
            amount: transaction.amount,
            description: transaction.description,
            date: transaction.date,
            type: new TransactionType(transaction.type),
            category: {
                id: transaction.category.id,
                name: transaction.category.name,
            },
            wallet: {
                id: transaction.wallet.id,
                name: transaction.wallet.name,
            },
        }));
    }

    async existsById(id: string): Promise<boolean> {
        return this.transactionRepository.exists({
            where: { id },
        });
    }
}
