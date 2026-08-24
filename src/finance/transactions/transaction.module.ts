import { Module } from '@nestjs/common';
import { TransactionController } from './presentation/controllers/transaction.controller';
import { SharedModule } from '@/shared/shared.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionEntity } from '@/shared/infra/database/entities/typeorm-transaction.entity';
import { CreateTransactionUseCase } from './app/use-cases/create-transaction.usecase';
import { ListTransactionsUseCase } from './app/use-cases/list-transactions.usecase';
import { FINANCE_TOKENS } from '../finance.tokens';
import { TypeOrmTransactionRepository } from './infra/repositories/typeorm-transaction.repository';
import { WalletModule } from '../wallets/wallet.module';
import { CategoryModule } from '../categories/category.module';
import { TypeOrmTransactionQuery } from './infra/queries/typeorm-transaction.query';

@Module({
    imports: [
        SharedModule,
        WalletModule,
        CategoryModule,
        TypeOrmModule.forFeature([TransactionEntity]),
    ],
    controllers: [TransactionController],
    providers: [
        CreateTransactionUseCase,
        ListTransactionsUseCase,

        {
            provide: FINANCE_TOKENS.TRANSACTION_REPOSITORY,
            useClass: TypeOrmTransactionRepository,
        },

        {
            provide: FINANCE_TOKENS.TRANSACTION_QUERY,
            useClass: TypeOrmTransactionQuery,
        },
    ],
    exports: [
        FINANCE_TOKENS.TRANSACTION_REPOSITORY,
        FINANCE_TOKENS.TRANSACTION_QUERY,
    ],
})
export class TransactionModule {}
