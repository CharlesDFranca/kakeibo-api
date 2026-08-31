import { CurrentUserId } from '@/core/decorators/current-user-id.decorator';
import { CreateTransferUseCase } from '@/finance/app/use-cases/transfers/create-transfer.usecase';
import { RevertTransferUseCase } from '@/finance/app/use-cases/transfers/revert-transfer.usecase';
import {
    Controller,
    Post,
    HttpCode,
    HttpStatus,
    Body,
    Param,
} from '@nestjs/common';
import { CreateTransferDto } from '../dtos/create-transfer.dto';
import { RevertTransferDto } from '../dtos/revert-transfer.dto';

@Controller('transfers')
export class TransferController {
    constructor(
        private readonly createTransferUseCase: CreateTransferUseCase,
        private readonly revertTransferUseCase: RevertTransferUseCase,
    ) {}

    @Post()
    @HttpCode(HttpStatus.CREATED)
    async create(
        @CurrentUserId() userId: string,
        @Body()
        body: CreateTransferDto,
    ) {
        return this.createTransferUseCase.execute({
            userId,
            amount: body.amount,
            categoryId: body.categoryId,
            destinationWalletId: body.destinationWalletId,
            sourceWalletId: body.sourceWalletId,
        });
    }

    @Post('id')
    @HttpCode(HttpStatus.OK)
    async revert(
        @CurrentUserId() userId: string,
        @Param('id') transferId: string,
        @Body() body: RevertTransferDto,
    ) {
        await this.revertTransferUseCase.execute({
            userId,
            transferId,
            categoryId: body.categoryId,
        });
    }
}
