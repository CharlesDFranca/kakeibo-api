import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { GetFinanceSummaryUseCase } from './app/use-cases/get-finance-summary.usecase';

@Controller('finances')
export class FinanceController {
    constructor(
        private readonly getFinanceSummaryUseCase: GetFinanceSummaryUseCase,
    ) {}

    @Get()
    @HttpCode(HttpStatus.OK)
    async summary() {
        return this.getFinanceSummaryUseCase.execute();
    }
}
