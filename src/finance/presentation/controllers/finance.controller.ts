import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { CurrentUserId } from '@/core/decorators/current-user-id.decorator';
import { GetFinanceSummaryUseCase } from '@/finance/app/use-cases/summary';

@Controller('finances')
export class FinanceController {
    constructor(
        private readonly getFinanceSummaryUseCase: GetFinanceSummaryUseCase,
    ) {}

    @Get()
    @HttpCode(HttpStatus.OK)
    async summary(@CurrentUserId() userId: string) {
        return this.getFinanceSummaryUseCase.execute({ userId });
    }
}
