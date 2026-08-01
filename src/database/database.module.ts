import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSourceOptions } from 'typeorm';
import { WalletEntity } from './entities/typeorm-wallet.entity';
import { CategoryEntity } from './entities/typeorm-category.entity';
import { TransactionEntity } from './entities/typeorm-transaction.entity';

export const dataSourceOptions: DataSourceOptions = {
    type: 'postgres',
    url: process.env.DB_URL as string,
    entities: [WalletEntity, CategoryEntity, TransactionEntity],
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
