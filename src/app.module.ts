import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FinanceModule } from './finance/finance.module';
import { DatabaseModule } from './shared/database/database.module';
import { SharedModule } from './shared/shared.module';
import { RedisModule } from './redis/redis.module';
import { IdentityModule } from './identity/identity.module';

@Module({
    imports: [
        FinanceModule,
        DatabaseModule,
        SharedModule,
        RedisModule,
        IdentityModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
