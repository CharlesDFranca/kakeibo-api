import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FinanceModule } from './finance/finance.module';
import { SharedModule } from './shared/shared.module';
import { IdentityModule } from './identity/identity.module';
import { DatabaseModule } from './shared/infra/database/database.module';
import { RedisModule } from './shared/infra/redis/redis.module';

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
