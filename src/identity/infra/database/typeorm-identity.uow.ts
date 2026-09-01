import { BaseTypeOrmUnitOfWork } from '@/core/infra/database/unit-of-work/base-typeorm-unit-of-work';
import { TransactionContext } from '@/core/infra/database/unit-of-work/transaction-context';
import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { IIdentityUnitOfWork } from '@/identity/app/contracts/identity-unit-of-work.contract';
import { IUserRepository } from '@/identity/domain/repositories/user-repository.interface';
import { UserEntity } from '../entities/typeorm-user.entity';
import { TypeOrmUserRepository } from '../repositories/typeorm-user.repository';

@Injectable()
export class TypeOrmIdentityUnitOfWork
    extends BaseTypeOrmUnitOfWork
    implements IIdentityUnitOfWork
{
    constructor(dataSource: DataSource) {
        super(dataSource);
    }

    getUserRepository(): IUserRepository {
        const manager = TransactionContext.getManager(this.dataSource.manager);
        return new TypeOrmUserRepository(manager.getRepository(UserEntity));
    }
}
