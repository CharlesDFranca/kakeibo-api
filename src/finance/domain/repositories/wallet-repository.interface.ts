import { Wallet } from '../entities/wallet.entity';

export interface IWalletRepository {
    create(wallet: Wallet): Promise<void>;
    update(wallet: Wallet): Promise<void>;
    findAllForUser(userId: string): Promise<Wallet[]>;
    findUserWalletByName(userId: string, name: string): Promise<Wallet | null>;
    findUserWalletById(
        userId: string,
        walletId: string,
    ): Promise<Wallet | null>;
    deleteUserWallet(userId: string, walletId: string): Promise<void>;
}
