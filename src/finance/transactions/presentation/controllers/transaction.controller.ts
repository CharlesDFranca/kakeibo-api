import { CreateTransactionUseCase } from '@/finance/transactions/app/use-cases/create-transaction.usecase';
import { ListTransactionsUseCase } from '@/finance/transactions/app/use-cases/list-transactions.usecase';
import { ETransactionType } from '@/finance/transactions/domain/enums/transaction-type.enum';
import { CurrentUserId } from '@/identity/auth/presentation/decorators/current-user-id.decorator';
import { parseEnum } from '@/shared/utils/parse-enum';
import {
    Body,
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    Post,
} from '@nestjs/common';

type CreateTransactionDTO = {
    amount: string;
    categoryId: string;
    date: Date;
    description: string;
    type: 'INCOME' | 'EXPENSE' | 'TRANSFER';
    walletId: string;
};

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
        @Body() body: CreateTransactionDTO,
    ) {
        const transaction = await this.createTransactionUseCase.execute({
            userId,
            amount: body.amount,
            description: body.description,
            date: new Date(body.date),
            type: parseEnum(body.type, ETransactionType),
            categoryId: body.categoryId,
            walletId: body.walletId,
        });

        return transaction;
    }

    @Get()
    @HttpCode(HttpStatus.OK)
    async list(@CurrentUserId() userId: string) {
        return this.listTransactionsUseCase.execute({ userId });
    }
}
