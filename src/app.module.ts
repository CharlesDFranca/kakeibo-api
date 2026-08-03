import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FinanceModule } from './finance/finance.module';
import { SharedModule } from './shared/shared.module';
import { IdentityModule } from './identity/identity.module';

@Module({
    imports: [SharedModule, FinanceModule, IdentityModule],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
