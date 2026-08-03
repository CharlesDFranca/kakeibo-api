import { Module } from '@nestjs/common';
import { CreateCategoryUseCase } from './app/use-cases/create-category.usecase';
import { TypeOrmCategoryRepository } from './infra/repositories/typeorm-category.repositoy';
import { CreateWalletUseCase } from './app/use-cases/create-wallet.usecase';
import { CreateTransactionUseCase } from './app/use-cases/create-transaction.usecase';
import { TypeOrmWalletRepository } from './infra/repositories/typeorm-wallet.repository';
import { TypeOrmTransactionRepository } from './infra/repositories/typeorm-transaction.repository';
import { TypeOrmCategoryMapper } from './infra/mappers/typeorm-category.mapper';
import { TypeOrmWalletMapper } from './infra/mappers/typeorm-wallet.mapper';
import { TypeOrmTransactionMapper } from './infra/mappers/typeorm-transaction.mapper';
import { ListCategoriesUseCase } from './app/use-cases/list-categories.usecase';
import { ListTransactionsUseCase } from './app/use-cases/list-transactions.usecase';
import { ListWalletsUseCase } from './app/use-cases/list-wallets.usecase';
import { DeleteWalletUseCase } from './app/use-cases/delete-wallet.usecase';
import { RenameWalletUseCase } from './app/use-cases/rename-wallet.usecase';
import { GetFinanceSummaryUseCase } from './app/use-cases/get-finance-summary.usecase';
import { SharedModule } from '@/shared/shared.module';
import { FINANCE_TOKENS } from './finance.tokens';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryEntity } from '@/shared/database/entities/typeorm-category.entity';
import { WalletEntity } from '@/shared/database/entities/typeorm-wallet.entity';
import { TransactionEntity } from '@/shared/database/entities/typeorm-transaction.entity';
import { CategoryController } from './presentation/controllers/category.controller';
import { WalletController } from './presentation/controllers/wallet.controller';
import { TransactionController } from './presentation/controllers/transaction.controller';
import { FinanceController } from './finance.controller';

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
