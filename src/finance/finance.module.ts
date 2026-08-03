import { Module } from '@nestjs/common';
import { CreateCategoryUseCase } from './categories/app/use-cases/create-category.usecase';
import { CreateWalletUseCase } from './app/use-cases/create-wallet.usecase';
import { CreateTransactionUseCase } from './wallets/app/use-cases/create-transaction.usecase';
import { TypeOrmWalletRepository } from './infra/repositories/typeorm-wallet.repository';
import { TypeOrmTransactionRepository } from './wallets/infra/repositories/typeorm-transaction.repository';
import { TypeOrmCategoryMapper } from './categories/infra/mappers/typeorm-category.mapper';
import { TypeOrmWalletMapper } from './infra/mappers/typeorm-wallet.mapper';
import { TypeOrmTransactionMapper } from './wallets/infra/mappers/typeorm-transaction.mapper';
import { ListCategoriesUseCase } from './categories/app/use-cases/list-categories.usecase';
import { ListTransactionsUseCase } from './wallets/app/use-cases/list-transactions.usecase';
import { ListWalletsUseCase } from './app/use-cases/list-wallets.usecase';
import { DeleteWalletUseCase } from './app/use-cases/delete-wallet.usecase';
import { RenameWalletUseCase } from './app/use-cases/rename-wallet.usecase';
import { GetFinanceSummaryUseCase } from './app/use-cases/get-finance-summary.usecase';
import { SharedModule } from '@/shared/shared.module';
import { FINANCE_TOKENS } from './finance.tokens';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryController } from './categories/presentation/controllers/category.controller';
import { WalletController } from './presentation/controllers/wallet.controller';
import { TransactionController } from './wallets/presentation/controllers/transaction.controller';
import { FinanceController } from './finance.controller';
import { CategoryEntity } from '@/shared/infra/database/entities/typeorm-category.entity';
import { TransactionEntity } from '@/shared/infra/database/entities/typeorm-transaction.entity';
import { WalletEntity } from '@/shared/infra/database/entities/typeorm-wallet.entity';
import { TypeOrmCategoryRepository } from './categories/infra/repositories/typeorm-category.repositoy';

@Module({
    controllers: [
        CategoryController,
        WalletController,
        TransactionController,
        FinanceController,
    ],
    imports: [
        SharedModule,
        TypeOrmModule.forFeature([
            CategoryEntity,
            WalletEntity,
            TransactionEntity,
        ]),
    ],
    providers: [
        // #region use-cases
        CreateCategoryUseCase,
        CreateWalletUseCase,
        CreateTransactionUseCase,
        ListCategoriesUseCase,
        ListTransactionsUseCase,
        ListWalletsUseCase,
        DeleteWalletUseCase,
        RenameWalletUseCase,
        GetFinanceSummaryUseCase,
        //#endregion

        //#region repositories
        {
            provide: FINANCE_TOKENS.CATEGORY_REPOSITORY,
            useClass: TypeOrmCategoryRepository,
        },
        {
            provide: FINANCE_TOKENS.WALLET_REPOSITORY,
            useClass: TypeOrmWalletRepository,
        },
        {
            provide: FINANCE_TOKENS.TRANSACTION_REPOSITORY,
            useClass: TypeOrmTransactionRepository,
        },
        //#endregion

        //#region mappers
        TypeOrmCategoryMapper,
        TypeOrmWalletMapper,
        TypeOrmTransactionMapper,
        //#endregion
    ],
    exports: [
        CreateCategoryUseCase,
        CreateWalletUseCase,
        CreateTransactionUseCase,
    ],
})
export class FinanceModule {}
