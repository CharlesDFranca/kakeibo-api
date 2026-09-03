import {
    CreateCategoryUseCase,
    ListCategoriesUseCase,
} from '@/finance/app/use-cases/categories';
import { CurrentUserId } from '@/core/decorators/current-user-id.decorator';
import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    HttpStatus,
    Param,
    Post,
} from '@nestjs/common';
import { CreateCategoryDto } from '../dtos/create-category.dto';
import { RemoveCategoryUseCase } from '@/finance/app/use-cases/categories/remove-category.usecase';

@Controller('categories')
export class CategoryController {
    constructor(
        private readonly createCategoryUseCase: CreateCategoryUseCase,
        private readonly listCategoriesUseCase: ListCategoriesUseCase,
        private readonly removeCategoryUseCase: RemoveCategoryUseCase,
    ) {}

    @Post()
    @HttpCode(HttpStatus.CREATED)
    async create(
        @CurrentUserId() userId: string,
        @Body() body: CreateCategoryDto,
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

    @Delete('id')
    @HttpCode(HttpStatus.NO_CONTENT)
    async remove(
        @CurrentUserId() userId: string,
        @Param('id') categoryId: string,
    ) {
        return this.removeCategoryUseCase.execute({ userId, categoryId });
    }
}
