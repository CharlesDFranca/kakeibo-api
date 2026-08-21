import { TransactionEntity } from '@/shared/infra/database/entities/typeorm-transaction.entity';
import { Injectable } from '@nestjs/common';
import { TransactionType } from '../../domain/value-objects/transaction-type.vo';
import { Transaction } from '../../domain/entities/transaction.entity';
import { TransactionDetails } from '../../app/types/transaction-details.type';
import { Money } from '@/shared/domain/value-objects/Money';

@Injectable()
export class TypeOrmTransactionMapper {
    public toDomain(raw: TransactionEntity): Transaction {
        return new Transaction(
            raw.id,
            {
                amount: Money.fromCents(raw.amount),
                categoryId: raw.categoryId,
                date: raw.date,
                description: raw.description,
                type: new TransactionType(raw.type),
                walletId: raw.walletId,
            },
            raw.createdAt,
            raw.updatedAt,
        );
    }

    public toPersistence(transaction: Transaction): TransactionEntity {
        const transactionEntity = new TransactionEntity();

        transactionEntity.id = transaction.id;
        transactionEntity.amount = transaction.amount.toCents();
        transactionEntity.description = transaction.description;
        transactionEntity.date = transaction.date;
        transactionEntity.type = transaction.type.value();
        transactionEntity.categoryId = transaction.categoryId;
        transactionEntity.walletId = transaction.walletId;
        transactionEntity.createdAt = transaction.createdAt;
        transactionEntity.updatedAt = transaction.updatedAt;

        return transactionEntity;
    }

    public toDetails(transaction: TransactionEntity): TransactionDetails {
        return {
            id: transaction.id,
            amount: Money.fromCents(transaction.amount).amount,
            description: transaction.description,
            type: transaction.type,
            date: transaction.date,
            category: {
                id: transaction.categoryId,
                name: transaction.category.name,
            },
            wallet: {
                id: transaction.walletId,
                name: transaction.wallet.name,
            },
        };
    }
}
