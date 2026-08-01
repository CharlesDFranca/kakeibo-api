import { WalletEntity } from '@/database/entities/typeorm-wallet.entity';
import { Wallet } from '@/finance/domain/entities/wallet.entity';

export class TypeOrmWalletMapper {
    public toDomain(raw: WalletEntity): Wallet {
        return new Wallet(
            raw.id,
            { name: raw.name, balance: raw.balance },
            raw.createdAt,
            raw.updatedAt,
        );
    }

    public toPersistence(wallet: Wallet): WalletEntity {
        const walletEntity = new WalletEntity();

        walletEntity.id = wallet.id;
        walletEntity.name = wallet.name;
        walletEntity.balance = wallet.balance;
        walletEntity.createdAt = wallet.createdAt;
        walletEntity.updatedAt = wallet.updatedAt;

        return walletEntity;
    }
}
