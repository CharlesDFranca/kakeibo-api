import { Module } from '@nestjs/common';
import { CategoryController } from './presentation/controllers/category.controller';
import { SharedModule } from '@/shared/shared.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryEntity } from '@/shared/infra/database/entities/typeorm-category.entity';
import { CreateCategoryUseCase } from './app/use-cases/create-category.usecase';
import { ListCategoriesUseCase } from './app/use-cases/list-categories.usecase';
import { FINANCE_TOKENS } from '../finance.tokens';
import { TypeOrmCategoryRepository } from './infra/repositories/typeorm-category.repositoy';

@Module({
    imports: [SharedModule, TypeOrmModule.forFeature([CategoryEntity])],
    controllers: [CategoryController],
    providers: [
        CreateCategoryUseCase,
        ListCategoriesUseCase,

        {
            provide: FINANCE_TOKENS.CATEGORY_REPOSITORY,
            useClass: TypeOrmCategoryRepository,
        },
    ],
    exports: [FINANCE_TOKENS.CATEGORY_REPOSITORY],
})
export class CategoryModule {}
