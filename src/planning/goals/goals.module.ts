import { Module } from '@nestjs/common';
import { GoalsController } from './presentation/goals.controller';

@Module({
    controllers: [GoalsController],
    providers: [],
})
export class GoalsModule {}
