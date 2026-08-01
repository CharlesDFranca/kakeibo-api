import { WalletEntity } from '@/database/entities/typeorm-wallet.entity';
import { Wallet } from '@/finance/domain/entities/wallet.entity';
import { IWalletRepository } from '@/finance/domain/repositories/wallet-repository.interface';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmWalletMapper } from '../mappers/typeorm-wallet.mapper';

@Injectable()
export class TypeOrmWalletRepository implements IWalletRepository {
    constructor(
        @InjectRepository(WalletEntity)
        private readonly walletRepository: Repository<WalletEntity>,
        private readonly mapper: TypeOrmWalletMapper,
    ) {}

    async create(wallet: Wallet): Promise<void> {
        const entity = this.mapper.toPersistence(wallet);
        await this.walletRepository.save(entity);
    }

    async update(wallet: Wallet): Promise<void> {
        const entity = this.mapper.toPersistence(wallet);
        await this.walletRepository.save(entity);
    }

    async delete(id: string): Promise<void> {
        await this.walletRepository.delete(id);
    }

    async findById(id: string): Promise<Wallet | null> {
        const wallet = await this.walletRepository.findOne({ where: { id } });

        if (!wallet) return null;

        return this.mapper.toDomain(wallet);
    }

    async findAll(): Promise<Wallet[]> {
        const wallets = await this.walletRepository.find();

        return wallets.map((wallet) => this.mapper.toDomain(wallet));
    }

    async findByName(name: string): Promise<Wallet | null> {
        const wallet = await this.walletRepository.findOne({ where: { name } });

        if (!wallet) return null;

        return this.mapper.toDomain(wallet);
    }
}
