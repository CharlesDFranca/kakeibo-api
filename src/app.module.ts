import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FinanceModule } from './finance/finance.module';
import { DatabaseModule } from './database/database.module';
import { SharedModule } from './shared/shared.module';

@Module({
    imports: [FinanceModule, DatabaseModule, SharedModule],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
