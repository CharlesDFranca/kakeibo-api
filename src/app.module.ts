import { Module } from '@nestjs/common';

import { IdentityModule } from './identity/identity.module';
import { FinanceModule } from './finance/finance.module';
import { PlanningModule } from './planning/planning.module';
import { CoreModule } from './core/core.module';

@Module({
    imports: [IdentityModule, FinanceModule, PlanningModule, CoreModule],
})
export class AppModule {}
