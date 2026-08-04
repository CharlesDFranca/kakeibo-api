import { CreateWalletUseCase } from '@/finance/wallets/app/use-cases/create-wallet.usecase';
import { DeleteWalletUseCase } from '@/finance/wallets/app/use-cases/delete-wallet.usecase';
import { ListWalletsUseCase } from '@/finance/wallets/app/use-cases/list-wallets.usecase';
import { RenameWalletUseCase } from '@/finance/wallets/app/use-cases/rename-wallet.usecase';
import { CurrentUserId } from '@/identity/auth/presentation/decorators/current-user-id.decorator';
import { SessionGuard } from '@/identity/auth/presentation/guards/session.guards';
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
    UseGuards,
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
    @UseGuards(SessionGuard)
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
    @UseGuards(SessionGuard)
    async list(@CurrentUserId() userId: string) {
        return this.listWalletsUseCase.execute({ userId });
    }

    @Patch(':id')
    @HttpCode(HttpStatus.OK)
    @UseGuards(SessionGuard)
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
    @UseGuards(SessionGuard)
    async delete(@CurrentUserId() userId: string, @Param('id') id: string) {
        await this.deleteWalletUseCase.execute({ walletId: id, userId });
    }
}
