import { CurrentUserId } from '@/core/decorators/current-user-id.decorator';
import { GetPlanningDashboardUseCase } from '@/planning/app/use-cases/dashboard/get-planning-dashboard.usecase';
import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';

@Controller('planning')
export class PlanningController {
    constructor(
        private readonly planningDashboardUseCase: GetPlanningDashboardUseCase,
    ) {}

    @Get('dashboard')
    @HttpCode(HttpStatus.OK)
    async findById(@CurrentUserId() userId: string) {
        return this.planningDashboardUseCase.execute({ userId });
    }
}
