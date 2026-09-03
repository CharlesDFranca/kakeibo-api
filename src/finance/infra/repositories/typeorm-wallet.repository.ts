import { Wallet } from '@/finance/domain/entities/wallet.entity';
import { IWalletRepository } from '@/finance/domain/repositories/wallet-repository.interface';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmWalletMapper } from '../mappers/typeorm-wallet.mapper';
import { WalletEntity } from '@/finance/infra/entities/typeorm-wallet.entity';
import { normalizeName } from '@/shared/utils/normalize-name';

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

    async findUserWalletByName(
        userId: string,
        name: string,
    ): Promise<Wallet | null> {
        const normalizedName = normalizeName(name);

        const wallet = await this.walletRepository.findOne({
            where: { userId, normalizedName },
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
