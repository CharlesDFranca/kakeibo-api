import { CreateCategoryUseCase } from '@/finance/categories/app/use-cases/create-category.usecase';
import { ListCategoriesUseCase } from '@/finance/categories/app/use-cases/list-categories.usecase';
import { CurrentUserId } from '@/identity/auth/presentation/decorators/current-user-id.decorator';
import {
    Body,
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    Post,
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
    async list(@CurrentUserId() userId: string) {
        return this.listCategoriesUseCase.execute({ userId });
    }
}
