import { CreateWalletUseCase } from '@/finance/wallets/app/use-cases/create-wallet.usecase';
import { DeleteWalletUseCase } from '@/finance/wallets/app/use-cases/delete-wallet.usecase';
import { ListWalletsUseCase } from '@/finance/wallets/app/use-cases/list-wallets.usecase';
import { RenameWalletUseCase } from '@/finance/wallets/app/use-cases/rename-wallet.usecase';
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
    async create(@Body() body: CreateWalletDTO) {
        const wallet = await this.createWalletUseCase.execute({
            name: body.name,
        });

        return wallet;
    }

    @Get()
    @HttpCode(HttpStatus.OK)
    async list() {
        return this.listWalletsUseCase.execute();
    }

    @Patch(':id')
    @HttpCode(HttpStatus.OK)
    async rename(@Param('id') id: string, @Body() body: { name: string }) {
        return this.renameWalletUseCase.execute({ id, name: body.name });
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    async delete(@Param('id') id: string) {
        await this.deleteWalletUseCase.execute({ id });
    }
}
