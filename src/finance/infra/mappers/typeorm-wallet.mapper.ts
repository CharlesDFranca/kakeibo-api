import { Wallet } from '@/finance/domain/entities/wallet.entity';
import { Money } from '@/shared/domain/value-objects/money.vo';
import { WalletEntity } from '@/shared/infra/database/entities/typeorm-wallet.entity';

export class TypeOrmWalletMapper {
    private constructor() {}

    public static toDomain(raw: WalletEntity): Wallet {
        return new Wallet(
            raw.id,
            {
                name: raw.name,
                balance: Money.fromCents(raw.balance),
                userId: raw.userId,
            },
            raw.createdAt,
            raw.updatedAt,
        );
    }

    public static toPersistence(wallet: Wallet): WalletEntity {
        const walletEntity = new WalletEntity();

        walletEntity.id = wallet.id;
        walletEntity.name = wallet.name;
        walletEntity.balance = wallet.balance.toCents();
        walletEntity.userId = wallet.userId;
        walletEntity.createdAt = wallet.createdAt;
        walletEntity.updatedAt = wallet.updatedAt;

        return walletEntity;
    }
}
