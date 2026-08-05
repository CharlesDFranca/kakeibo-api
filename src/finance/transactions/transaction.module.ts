import { Module } from '@nestjs/common';
import { TransactionController } from './presentation/controllers/transaction.controller';
import { SharedModule } from '@/shared/shared.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionEntity } from '@/shared/infra/database/entities/typeorm-transaction.entity';
import { CreateTransactionUseCase } from './app/use-cases/create-transaction.usecase';
import { ListTransactionsUseCase } from './app/use-cases/list-transactions.usecase';
import { FINANCE_TOKENS } from '../finance.tokens';
import { TypeOrmTransactionRepository } from './infra/repositories/typeorm-transaction.repository';
import { TypeOrmTransactionMapper } from './infra/mappers/typeorm-transaction.mapper';
import { WalletModule } from '../wallets/wallet.module';
import { CategoryModule } from '../categories/category.module';
import { AuthModule } from '@/identity/auth/auth.module';

@Module({
    controllers: [TransactionController],
    imports: [
        SharedModule,
        AuthModule,
        WalletModule,
        CategoryModule,
        TypeOrmModule.forFeature([TransactionEntity]),
    ],
    providers: [
        CreateTransactionUseCase,
        ListTransactionsUseCase,
        {
            provide: FINANCE_TOKENS.TRANSACTION_REPOSITORY,
            useClass: TypeOrmTransactionRepository,
        },
        TypeOrmTransactionMapper,
    ],
    exports: [FINANCE_TOKENS.TRANSACTION_REPOSITORY],
})
export class TransactionModule {}
