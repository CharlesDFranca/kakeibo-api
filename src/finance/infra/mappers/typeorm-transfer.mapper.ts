import { TransferEntity } from '../entities/typeorm-transfer.entity';
import { Transfer } from '@/finance/domain/entities/transfer.entity';
import { Money } from '@/shared/domain/value-objects/money.vo';

export class TypeOrmTransferMapper {
    private constructor() {}

    public static toDomain(raw: TransferEntity): Transfer {
        return new Transfer(
            raw.id,
            {
                amount: Money.fromCents(raw.amount),
                sourceWalletId: raw.sourceWalletId,
                destinationWalletId: raw.destinationWalletId,
                sourceTransactionId: raw.sourceTransactionId,
                destinationTransactionId: raw.destinationTransactionId,
                status: raw.status
            },
            raw.createdAt,
            raw.updatedAt,
        );
    }

    public static toPersistence(transfer: Transfer): TransferEntity {
        const transferEntity = new TransferEntity();

        transferEntity.id = transfer.id;
        transferEntity.amount = transfer.amount.toCents();
        transferEntity.sourceWalletId = transfer.sourceWalletId;
        transferEntity.destinationWalletId = transfer.destinationWalletId;
        transferEntity.sourceTransactionId = transfer.sourceTransactionId;
        transferEntity.destinationTransactionId =
            transfer.destinationTransactionId;
        transferEntity.status = transfer.status
        transferEntity.createdAt = transfer.createdAt;
        transferEntity.updatedAt = transfer.updatedAt;

        return transferEntity;
    }
}
