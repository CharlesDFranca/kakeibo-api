import { Category } from '@/finance/categories/domain/entities/category.entity';
import type { ICategoryRepository } from '@/finance/domain/repositories/category-repository.interface';
import { FINANCE_TOKENS } from '@/finance/finance.tokens';
import { IBaseUseCase } from '@/shared/app/contracts/base-usecase.contract';
import type { IIDGenerator } from '@/shared/app/contracts/id-generator.contract';
import { SHARED_TOKENS } from '@/shared/shared.token';
import { Inject, Injectable } from '@nestjs/common';

type CreateCategoryInput = {
    name: string;
};

type CreateCategoryOutput = {
    id: string;
};

@Injectable()
export class CreateCategoryUseCase implements IBaseUseCase<
    CreateCategoryInput,
    CreateCategoryOutput
> {
    constructor(
        @Inject(FINANCE_TOKENS.CATEGORY_REPOSITORY)
        private readonly categoryRepository: ICategoryRepository,
        @Inject(SHARED_TOKENS.ID_GENERATOR)
        private readonly idGenerator: IIDGenerator,
    ) {}

    async execute(input: CreateCategoryInput): Promise<CreateCategoryOutput> {
        const existsByName = await this.categoryRepository.findByName(
            input.name,
        );

        if (existsByName) throw new Error('Category already exists');

        const now = new Date();

        const category = new Category(
            this.idGenerator.generate(),
            {
                name: input.name,
            },
            now,
            now,
        );

        await this.categoryRepository.create(category);

        return { id: category.id };
    }
}
