import {
    CreateWalletUseCase,
    DeleteWalletUseCase,
    ListWalletsUseCase,
    RenameWalletUseCase,
} from '@/finance/app/use-cases/wallets';

import { CurrentUserId } from '@/core/decorators/current-user-id.decorator';
import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    HttpStatus,
    Param,
    Patch,
    Post,
} from '@nestjs/common';
import { CreateWalletDto } from '../dtos/create-wallet.dto';
import { RenameWalletDto } from '../dtos/rename-wallet.dto';
import { Money } from '@/shared/domain/value-objects/money.vo';

@Controller('wallets')
export class WalletController {
    constructor(
        private readonly createWalletUseCase: CreateWalletUseCase,
        private readonly listWalletsUseCase: ListWalletsUseCase,
        private readonly renameWalletUseCase: RenameWalletUseCase,
        private readonly deleteWalletUseCase: DeleteWalletUseCase,
    ) {}

    @Post()
    @HttpCode(HttpStatus.CREATED)
    async create(
        @CurrentUserId() userId: string,
        @Body() body: CreateWalletDto,
    ) {
        const wallet = await this.createWalletUseCase.execute({
            userId,
            name: body.name,
            balance: body.balance,
        });

        return wallet;
    }

    @Get()
    @HttpCode(HttpStatus.OK)
    async list(@CurrentUserId() userId: string) {
        return this.listWalletsUseCase.execute({ userId });
    }

    @Patch(':id')
    @HttpCode(HttpStatus.OK)
    async rename(
        @CurrentUserId() userId: string,
        @Param('id') id: string,
        @Body() body: RenameWalletDto,
    ) {
        return this.renameWalletUseCase.execute({
            walletId: id,
            name: body.name,
            userId,
        });
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    async delete(@CurrentUserId() userId: string, @Param('id') id: string) {
        await this.deleteWalletUseCase.execute({ walletId: id, userId });
    }
}
