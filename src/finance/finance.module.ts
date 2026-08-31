import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CoreModule } from '@/core/core.module';
import { PlanningModule } from '@/planning/planning.module';

import { FINANCE_TOKENS } from './finance.tokens';
import { FinanceController } from './presentation/controllers/finance.controller';
import { WalletController } from './presentation/controllers/wallet.controller';
import { TransactionController } from './presentation/controllers/transaction.controller';
import { CategoryController } from './presentation/controllers/category.controller';

import { GetFinanceSummaryUseCase } from './app/use-cases/summary/get-finance-summary.usecase';
import { CreateWalletUseCase } from './app/use-cases/wallets/create-wallet.usecase';
import { ListWalletsUseCase } from './app/use-cases/wallets/list-wallets.usecase';
import { DeleteWalletUseCase } from './app/use-cases/wallets/delete-wallet.usecase';
import { RenameWalletUseCase } from './app/use-cases/wallets/rename-wallet.usecase';
import { CreateTransactionUseCase } from './app/use-cases/transactions/create-transaction.usecase';
import { ListTransactionsUseCase } from './app/use-cases/transactions/list-transactions.usecase';
import { CreateCategoryUseCase } from './app/use-cases/categories/create-category.usecase';
import { ListCategoriesUseCase } from './app/use-cases/categories/list-categories.usecase';

import { WalletEntity } from './infra/entities/typeorm-wallet.entity';
import { TransactionEntity } from './infra/entities/typeorm-transaction.entity';
import { CategoryEntity } from './infra/entities/typeorm-category.entity';

import { TypeOrmWalletRepository } from './infra/repositories/typeorm-wallet.repository';
import { TypeOrmTransactionRepository } from './infra/repositories/typeorm-transaction.repository';
import { TypeOrmTransferRepository } from './infra/repositories/typeorm-transfer.repository';
import { TypeOrmCategoryRepository } from './infra/repositories/typeorm-category.repository';
import { TypeOrmTransactionQuery } from './infra/queries/typeorm-transaction.query';
import { WalletDeletionPolicy } from './app/policies/wallet-deletion.policy';
import { TypeOrmFinanceUnitOfWork } from './infra/database/typeorm-finance.uow';
import { FinanceFacade } from './app/services/finance-facade';
import { CreateTransferUseCase } from './app/use-cases/transfers/create-transfer.usecase';
import { TransferEntity } from './infra/entities/typeorm-transfer.entity';

@Module({
    imports: [
        CoreModule,
        forwardRef(() => PlanningModule),
        TypeOrmModule.forFeature([
            WalletEntity,
            TransactionEntity,
            CategoryEntity,
            TransferEntity,
        ]),
    ],
    controllers: [
        FinanceController,
        WalletController,
        TransactionController,
        CategoryController,
    ],
    providers: [
        GetFinanceSummaryUseCase,
        CreateWalletUseCase,
        ListWalletsUseCase,
        DeleteWalletUseCase,
        RenameWalletUseCase,
        CreateTransactionUseCase,
        ListTransactionsUseCase,
        CreateCategoryUseCase,
        ListCategoriesUseCase,
        CreateTransferUseCase,

        {
            provide: FINANCE_TOKENS.ENSURE_CAN_DELETE_WALLET,
            useClass: WalletDeletionPolicy,
        },

        {
            provide: FINANCE_TOKENS.WALLET_REPOSITORY,
            useClass: TypeOrmWalletRepository,
        },
        {
            provide: FINANCE_TOKENS.TRANSACTION_REPOSITORY,
            useClass: TypeOrmTransactionRepository,
        },
        {
            provide: FINANCE_TOKENS.CATEGORY_REPOSITORY,
            useClass: TypeOrmCategoryRepository,
        },
        {
            provide: FINANCE_TOKENS.TRANSFER_REPOSITORY,
            useClass: TypeOrmTransferRepository,
        },
        {
            provide: FINANCE_TOKENS.TRANSACTION_QUERY,
            useClass: TypeOrmTransactionQuery,
        },
        {
            provide: FINANCE_TOKENS.UNIT_OF_WORK,
            useClass: TypeOrmFinanceUnitOfWork,
        },

        {
            provide: FINANCE_TOKENS.FACADE,
            useClass: FinanceFacade,
        },
    ],
    exports: [FINANCE_TOKENS.FACADE],
})
export class FinanceModule {}
