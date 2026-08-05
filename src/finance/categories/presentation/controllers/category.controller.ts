import { CreateCategoryUseCase } from '@/finance/categories/app/use-cases/create-category.usecase';
import { ListCategoriesUseCase } from '@/finance/categories/app/use-cases/list-categories.usecase';
import { CurrentUserId } from '@/identity/auth/presentation/decorators/current-user-id.decorator';
import { SessionGuard } from '@/identity/auth/presentation/guards/session.guards';
import {
    Body,
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    Post,
    UseGuards,
} from '@nestjs/common';

type CreateCategoryDTO = {
    name: string;
};

@Controller('categories')
export class CategoryController {
    constructor(
        private readonly createCategoryUseCase: CreateCategoryUseCase,
        private readonly listCategoriesUseCase: ListCategoriesUseCase,
    ) {}

    @Post()
    @HttpCode(HttpStatus.CREATED)
    @UseGuards(SessionGuard)
    async create(
        @CurrentUserId() userId: string,
        @Body() body: CreateCategoryDTO,
    ) {
        const category = await this.createCategoryUseCase.execute({
            name: body.name,
            userId,
        });

        return category;
    }

    @Get()
    @HttpCode(HttpStatus.OK)
    @UseGuards(SessionGuard)
    async list(@CurrentUserId() userId: string) {
        return this.listCategoriesUseCase.execute({ userId });
    }
}
