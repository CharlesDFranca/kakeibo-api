import { Transation } from '../entities/transation.entity';

export interface ITransationRepository {
    create(transaction: Transation): Promise<void>;
    update(transaction: Transation): Promise<void>;
    delete(id: string): Promise<void>;
    findById(id: string): Promise<Transation | null>;
    findAll(): Promise<Transation[]>;
    existsById(id: string): Promise<boolean>;
}
