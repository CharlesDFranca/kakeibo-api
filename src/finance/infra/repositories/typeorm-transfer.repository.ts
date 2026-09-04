import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ITransferRepository } from '@/finance/domain/repositories/transfer-repository.interface';
import { Transfer } from '@/finance/domain/entities/transfer.entity';
import { TransferEntity } from '../entities/typeorm-transfer.entity';
import { TypeOrmTransferMapper } from '../mappers/typeorm-transfer.mapper';

@Injectable()
export class TypeOrmTransferRepository implements ITransferRepository {
    constructor(
        @InjectRepository(TransferEntity)
        private readonly transferRepository: Repository<TransferEntity>,
    ) {}

    async create(transfer: Transfer): Promise<void> {
        const entity = TypeOrmTransferMapper.toPersistence(transfer);
        await this.transferRepository.save(entity);
    }

    async findUserTransferById(
        userId: string,
        transferId: string,
    ): Promise<Transfer | null> {
        const transfer = await this.transferRepository.findOne({
            where: {
                id: transferId,
                sourceWallet: { userId },
                destinationWallet: { userId },
            },
        });

        if (!transfer) return null;

        return TypeOrmTransferMapper.toDomain(transfer);
    }

    async update(transfer: Transfer): Promise<void> {
        const entity = TypeOrmTransferMapper.toPersistence(transfer);
        await this.transferRepository.save(entity);
    }
}
