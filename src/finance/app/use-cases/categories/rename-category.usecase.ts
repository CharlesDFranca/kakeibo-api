import type { ICategoryRepository } from '@/finance/domain/repositories/category-repository.interface';
import { FINANCE_TOKENS } from '@/finance/finance.tokens';
import { IBaseUseCase } from '@/shared/app/contracts/base-usecase.contract';
import { Inject, Injectable } from '@nestjs/common';
import { CategoryNotFoundError } from '../../errors/category-not-found.error';
import { CategoryAlreadyExistsError } from '../../errors/category-already-exists.error';
import { Name } from '@/shared/domain/value-objects/name.vo';

type RenameCategoryInput = {
    userId: string;
    categoryId: string;
    name: string;
};

type RenameCategoryOutput = void;

@Injectable()
export class RenameCategoryUseCase implements IBaseUseCase<
    RenameCategoryInput,
    RenameCategoryOutput
> {
    constructor(
        @Inject(FINANCE_TOKENS.CATEGORY_REPOSITORY)
        private readonly categoryRepository: ICategoryRepository,
    ) {}

    async execute(input: RenameCategoryInput): Promise<void> {
        const category = await this.categoryRepository.findUserCategoryById(
            input.userId,
            input.categoryId,
        );

        if (!category) throw new CategoryNotFoundError();

        const existingCategory =
            await this.categoryRepository.findUserCategoryByName(
                input.userId,
                input.name,
            );

        if (existingCategory && !category.isEqual(existingCategory)) {
            throw new CategoryAlreadyExistsError();
        }

        category.rename(new Name(input.name));
        await this.categoryRepository.update(category);
    }
}
