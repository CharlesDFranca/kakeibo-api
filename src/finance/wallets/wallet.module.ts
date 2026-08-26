import { Module } from '@nestjs/common';
import { CreateWalletUseCase } from './app/use-cases/create-wallet.usecase';
import { TypeOrmWalletRepository } from './infra/repositories/typeorm-wallet.repository';
import { FINANCE_TOKENS } from '../finance.tokens';
import { ListWalletsUseCase } from './app/use-cases/list-wallets.usecase';
import { DeleteWalletUseCase } from './app/use-cases/delete-wallet.usecase';
import { RenameWalletUseCase } from './app/use-cases/rename-wallet.usecase';
import { SharedModule } from '@/shared/shared.module';
import { WalletController } from './presentation/controllers/wallet.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WalletEntity } from '@/shared/infra/database/entities/typeorm-wallet.entity';
import { WalletDeletionPolicy } from './app/policies/wallet-deletion.policy';
import { GoalsModule } from '@/planning/goals/goals.module';

@Module({
    imports: [
        SharedModule,
        GoalsModule,
        TypeOrmModule.forFeature([WalletEntity]),
    ],
    controllers: [WalletController],
    providers: [
        CreateWalletUseCase,
        ListWalletsUseCase,
        DeleteWalletUseCase,
        RenameWalletUseCase,

        {
            provide: FINANCE_TOKENS.WALLET_REPOSITORY,
            useClass: TypeOrmWalletRepository,
        },
        {
            provide: FINANCE_TOKENS.ENSURE_CAN_DELETE_WALLET,
            useClass: WalletDeletionPolicy,
        },
    ],
    exports: [FINANCE_TOKENS.WALLET_REPOSITORY],
})
export class WalletModule {}
