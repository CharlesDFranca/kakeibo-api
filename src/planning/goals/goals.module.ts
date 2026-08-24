import { Module } from '@nestjs/common';
import { GoalsController } from './presentation/goals.controller';
import { SharedModule } from '@/shared/shared.module';

@Module({
    imports: [SharedModule],
    controllers: [GoalsController],
    providers: [],
})
export class GoalsModule {}
