import { TransactionEntity } from '@/shared/database/entities/typeorm-transaction.entity';
import { Transaction } from '@/finance/domain/entities/transaction.entity';
import { TransactionType } from '@/finance/domain/value-objects/transaction-type.vo';
import { Injectable } from '@nestjs/common';

@Injectable()
export class TypeOrmTransactionMapper {
    public toDomain(raw: TransactionEntity): Transaction {
        return new Transaction(
            raw.id,
            {
                amount: raw.amount,
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
        transactionEntity.amount = transaction.amount;
        transactionEntity.description = transaction.description;
        transactionEntity.date = transaction.date;
        transactionEntity.type = transaction.type.value();
        transactionEntity.categoryId = transaction.categoryId;
        transactionEntity.walletId = transaction.walletId;
        transactionEntity.createdAt = transaction.createdAt;
        transactionEntity.updatedAt = transaction.updatedAt;

        return transactionEntity;
    }
}
