import { CategoryEntity } from '@/finance/infra/entities/typeorm-category.entity';
import { TransactionEntity } from '@/finance/infra/entities/typeorm-transaction.entity';
import { WalletEntity } from '@/finance/infra/entities/typeorm-wallet.entity';
import { UserEntity } from '@/identity/infra/entities/typeorm-user.entity';
import { GoalMovementEntity } from '@/planning/infra/entities/typeorm-goal-movement.entity';
import { GoalEntity } from '@/planning/infra/entities/typeorm-goal.entity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSourceOptions } from 'typeorm';

export const dataSourceOptions: DataSourceOptions = {
    type: 'postgres',
    url: process.env.DB_URL as string,
    entities: [
        WalletEntity,
        CategoryEntity,
        TransactionEntity,
        UserEntity,
        GoalEntity,
        GoalMovementEntity,
    ],
    migrations: [],
    synchronize: true,
};

@Module({
    imports: [
        TypeOrmModule.forRootAsync({
            useFactory: async () => {
                return {
                    ...dataSourceOptions,
                };
            },
        }),
    ],
})
export class DatabaseModule {}
