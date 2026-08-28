import { Wallet } from '@/finance/domain/entities/wallet.entity';
import { IWalletRepository } from '@/finance/domain/repositories/wallet-repository.interface';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmWalletMapper } from '../mappers/typeorm-wallet.mapper';
import { WalletEntity } from '@/shared/infra/database/entities/typeorm-wallet.entity';

@Injectable()
export class TypeOrmWalletRepository implements IWalletRepository {
    constructor(
        @InjectRepository(WalletEntity)
        private readonly walletRepository: Repository<WalletEntity>,
    ) {}

    async create(wallet: Wallet): Promise<void> {
        const entity = TypeOrmWalletMapper.toPersistence(wallet);
        await this.walletRepository.save(entity);
    }

    async update(wallet: Wallet): Promise<void> {
        const entity = TypeOrmWalletMapper.toPersistence(wallet);
        await this.walletRepository.save(entity);
    }

    async delete(id: string): Promise<void> {
        await this.walletRepository.delete(id);
    }

    async findById(id: string): Promise<Wallet | null> {
        const wallet = await this.walletRepository.findOne({ where: { id } });

        if (!wallet) return null;

        return TypeOrmWalletMapper.toDomain(wallet);
    }

    async findAll(): Promise<Wallet[]> {
        const wallets = await this.walletRepository.find();

        return wallets.map((wallet) => TypeOrmWalletMapper.toDomain(wallet));
    }

    async findByName(name: string): Promise<Wallet | null> {
        const wallet = await this.walletRepository.findOne({ where: { name } });

        if (!wallet) return null;

        return TypeOrmWalletMapper.toDomain(wallet);
    }

    async findUserWalletByName(
        userId: string,
        name: string,
    ): Promise<Wallet | null> {
        const wallet = await this.walletRepository.findOne({
            where: { userId, name },
        });

        if (!wallet) return null;

        return TypeOrmWalletMapper.toDomain(wallet);
    }

    async findAllForUser(userId: string): Promise<Wallet[]> {
        const wallets = await this.walletRepository.find({ where: { userId } });

        return wallets.map((wallet) => TypeOrmWalletMapper.toDomain(wallet));
    }

    async findUserWalletById(
        userId: string,
        walletId: string,
    ): Promise<Wallet | null> {
        const wallet = await this.walletRepository.findOne({
            where: { id: walletId, userId },
        });

        if (!wallet) return null;

        return TypeOrmWalletMapper.toDomain(wallet);
    }

    async deleteUserWallet(userId: string, id: string): Promise<void> {
        await this.walletRepository.delete({ userId, id });
    }
}
