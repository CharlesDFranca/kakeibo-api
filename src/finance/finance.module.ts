import { Module } from '@nestjs/common';
import { SharedModule } from '@/shared/shared.module';
import { FinanceController } from './finance.controller';
import { WalletModule } from './wallets/wallet.module';
import { TransactionModule } from './transactions/transaction.module';
import { CategoryModule } from './categories/category.module';
import { GetFinanceSummaryUseCase } from './app/use-cases/get-finance-summary.usecase';
import { AuthModule } from '@/identity/auth/auth.module';

@Module({
    controllers: [FinanceController],
    imports: [
        SharedModule,
        AuthModule,
        WalletModule,
        TransactionModule,
        CategoryModule,
    ],
    providers: [GetFinanceSummaryUseCase],
    exports: [],
})
export class FinanceModule {}
