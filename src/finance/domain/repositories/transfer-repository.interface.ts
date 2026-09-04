import { Transfer } from '../entities/transfer.entity';

export interface ITransferRepository {
    create(transfer: Transfer): Promise<void>;
    update(transfer: Transfer): Promise<void>;
    findUserTransferById(
        userId: string,
        transferId: string,
    ): Promise<Transfer | null>;
}
