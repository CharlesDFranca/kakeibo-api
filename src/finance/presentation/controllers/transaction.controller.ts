import { CreateTransactionUseCase } from '@/finance/app/use-cases/create-transaction.usecase';
import { ListTransactionsUseCase } from '@/finance/app/use-cases/list-transactions.usecase';
import { ETransactionType } from '@/finance/domain/enums/transaction-type.enum';
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
    amount: number;
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
    async create(@Body() body: CreateTransactionDTO) {
        const transaction = await this.createTransactionUseCase.execute({
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
    async list() {
        return this.listTransactionsUseCase.execute();
    }
}
