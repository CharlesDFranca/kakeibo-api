import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSourceOptions } from 'typeorm';

export const dataSourceOptions: DataSourceOptions = {
    type: 'postgres',
    url: process.env.DB_URL as string,
    entities: [],
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
