import {
    CreateTransactionUseCase,
    ListTransactionsUseCase,
} from '@/finance/app/use-cases/transactions';
import { CurrentUserId } from '@/core/decorators/current-user-id.decorator';
import {
    Body,
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    Post,
    Query,
} from '@nestjs/common';
import { CreateTransactionDto } from '../dtos/create-transaction.dto';
import { ListTransactionsDto } from '../dtos/list-transaction.dto';

@Controller('transactions')
export class TransactionController {
    constructor(
        private readonly createTransactionUseCase: CreateTransactionUseCase,
        private readonly listTransactionsUseCase: ListTransactionsUseCase,
    ) {}

    @Post()
    @HttpCode(HttpStatus.CREATED)
    async create(
        @CurrentUserId() userId: string,
        @Body() body: CreateTransactionDto,
    ) {
        const transaction = await this.createTransactionUseCase.execute({
            userId,
            amount: body.amount,
            description: body.description,
            date: new Date(body.date),
            type: body.type,
            categoryId: body.categoryId,
            walletId: body.walletId,
        });

        return transaction;
    }

    @Get()
    @HttpCode(HttpStatus.OK)
    async list(
        @CurrentUserId() userId: string,
        @Query() query: ListTransactionsDto,
    ) {
        return this.listTransactionsUseCase.execute({
            userId,
            filters: {
                categoryIds: query.categoryIds,
                walletIds: query.walletIds,
                startDate: query.startDate
                    ? new Date(query.startDate)
                    : undefined,
                endDate: query.endDate ? new Date(query.endDate) : undefined,
                type: query.type,
            },
        });
    }
}
