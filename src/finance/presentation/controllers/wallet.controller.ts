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

type CreateWalletDTO = {
    name: string;
};

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
        @Body() body: CreateWalletDTO,
    ) {
        const wallet = await this.createWalletUseCase.execute({
            userId,
            name: body.name,
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
        @Body() body: { name: string },
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
