import { Controller, Get, HttpCode, HttpStatus, Query } from '@nestjs/common';
import { CurrentUserId } from '@/core/decorators/current-user-id.decorator';
import { GetFinanceDashboardUseCase } from '@/finance/app/use-cases/dashboard/get-finance-dashboard.usecase';
import { GetFinanceDashboardDto } from '../dtos/finance-dashboard.dto';

@Controller('finance')
export class FinanceController {
    constructor(
        private readonly getFinanceDashboardUseCase: GetFinanceDashboardUseCase,
    ) {}

    @Get('dashboard')
    @HttpCode(HttpStatus.OK)
    async getDashboard(
        @CurrentUserId() userId: string,
        @Query() query: GetFinanceDashboardDto,
    ) {
        return this.getFinanceDashboardUseCase.execute({
            userId,
            startDate: query.startDate ? new Date(query.startDate) : undefined,
            endDate: query.endDate ? new Date(query.endDate) : undefined,
        });
    }
}
