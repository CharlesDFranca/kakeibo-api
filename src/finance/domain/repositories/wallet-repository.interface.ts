import { Wallet } from '../entities/wallet.entity';

export interface IWalletRepository {
    create(wallet: Wallet): Promise<void>;
    update(wallet: Wallet): Promise<void>;
    delete(id: string): Promise<void>;
    findById(id: string): Promise<Wallet | null>;
    findAll(): Promise<Wallet[]>;
    existsByName(name: string): Promise<boolean>;
}
