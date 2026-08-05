import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { GetFinanceSummaryUseCase } from './app/use-cases/get-finance-summary.usecase';
import { CurrentUserId } from '@/identity/auth/presentation/decorators/current-user-id.decorator';

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
