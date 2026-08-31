import { Transfer } from '../entities/transfer.entity';

export interface ITransferRepository {
    create(transfer: Transfer): Promise<void>;
    findUserTransferById(id: string): Promise<Transfer>;
}
