import { Module } from '@nestjs/common';

import { IdentityModule } from './identity/identity.module';
import { FinanceModule } from './finance/finance.module';
import { PlanningModule } from './planning/planning.module';
import { SharedModule } from './shared/shared.module';

@Module({
    imports: [SharedModule, IdentityModule, FinanceModule, PlanningModule],
})
export class AppModule {}
