import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FinanceModule } from './finance/finance.module';
import { DatabaseModule } from './database/database.module';
import { SharedModule } from './shared/shared.module';
import { RedisModule } from './redis/redis.module';
import { UsersModule } from './identity/users/users.module';

@Module({
    imports: [
        FinanceModule,
        DatabaseModule,
        SharedModule,
        UsersModule,
        RedisModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
