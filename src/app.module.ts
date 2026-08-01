import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FinanceModule } from './finance/finance.module';
import { DatabaseModule } from './database/database.module';

@Module({
    imports: [FinanceModule, DatabaseModule],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
