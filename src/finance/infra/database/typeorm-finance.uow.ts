import { BaseTypeOrmUnitOfWork } from '@/core/infra/database/unit-of-work/base-typeorm-unit-of-work';
import { TransactionContext } from '@/core/infra/database/unit-of-work/transaction-context';
import { IFinanceUnitOfWork } from '@/finance/app/contracts/finance-unit-of-work.contract';
import { ICategoryRepository } from '@/finance/domain/repositories/category-repository.interface';
import { ITransactionRepository } from '@/finance/domain/repositories/transaction-repository.interface';
import { IWalletRepository } from '@/finance/domain/repositories/wallet-repository.interface';
import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { CategoryEntity } from '../entities/typeorm-category.entity';
import { TransactionEntity } from '../entities/typeorm-transaction.entity';
import { WalletEntity } from '../entities/typeorm-wallet.entity';
import { TypeOrmCategoryRepository } from '../repositories/typeorm-category.repository';
import { TypeOrmTransactionRepository } from '../repositories/typeorm-transaction.repository';
import { TypeOrmWalletRepository } from '../repositories/typeorm-wallet.repository';

@Injectable()
export class TypeOrmFinanceUnitOfWork
    extends BaseTypeOrmUnitOfWork
    implements IFinanceUnitOfWork
{
    constructor(dataSource: DataSource) {
        super(dataSource);
    }

    public getWalletRepository(): IWalletRepository {
        const manager = TransactionContext.getManager(this.dataSource.manager);
        return new TypeOrmWalletRepository(manager.getRepository(WalletEntity));
    }

    public getTransactionRepository(): ITransactionRepository {
        const manager = TransactionContext.getManager(this.dataSource.manager);
        return new TypeOrmTransactionRepository(
            manager.getRepository(TransactionEntity),
        );
    }

    public getCategoryRepository(): ICategoryRepository {
        const manager = TransactionContext.getManager(this.dataSource.manager);
        return new TypeOrmCategoryRepository(
            manager.getRepository(CategoryEntity),
        );
    }
}
