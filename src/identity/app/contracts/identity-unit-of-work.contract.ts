import { IUserRepository } from '@/identity/domain/repositories/user-repository.interface';

export interface IIdentityUnitOfWork {
    transaction<T>(work: () => Promise<T>): Promise<T>;
    getUserRepository(): IUserRepository;
}
