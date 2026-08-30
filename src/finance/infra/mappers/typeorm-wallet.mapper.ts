import { Wallet } from '@/finance/domain/entities/wallet.entity';
import { Money } from '@/shared/domain/value-objects/money.vo';
import { WalletEntity } from '@/finance/infra/entities/typeorm-wallet.entity';
import { Name } from '@/shared/domain/value-objects/name.vo';

export class TypeOrmWalletMapper {
    private constructor() {}

    public static toDomain(raw: WalletEntity): Wallet {
        return new Wallet(
            raw.id,
            {
                name: new Name(raw.name),
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
        walletEntity.name = wallet.name.value;
        walletEntity.balance = wallet.balance.toCents();
        walletEntity.userId = wallet.userId;
        walletEntity.createdAt = wallet.createdAt;
        walletEntity.updatedAt = wallet.updatedAt;

        return walletEntity;
    }
}
