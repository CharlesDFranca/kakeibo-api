import type { ICategoryRepository } from '@/finance/domain/repositories/category-repository.interface';
import type { ICategoryDeletionPolicy } from '@/finance/domain/services/category-deletion-policy.interface';
import { FINANCE_TOKENS } from '@/finance/finance.tokens';
import { IBaseUseCase } from '@/shared/app/contracts/base-usecase.contract';
import { Inject, Injectable } from '@nestjs/common';
import { CategoryNotFoundError } from '../../errors/category-not-found.error';
import { SystemCategoryCannotBeRemovedError } from '@/finance/domain/errors/system-category-cannot-be-removed.error';

type RemoveCategoryInput = {
    userId: string;
    categoryId: string;
};

type RemoveCategoryOutput = void;

@Injectable()
export class RemoveCategoryUseCase implements IBaseUseCase<
    RemoveCategoryInput,
    RemoveCategoryOutput
> {
    constructor(
        @Inject(FINANCE_TOKENS.CATEGORY_DELETION_POLICY)
        private readonly categoryDeletionPolicy: ICategoryDeletionPolicy,
        @Inject(FINANCE_TOKENS.CATEGORY_REPOSITORY)
        private readonly categoryRepository: ICategoryRepository,
    ) {}

    async execute(input: RemoveCategoryInput): Promise<void> {
        const category = await this.categoryRepository.findUserCategoryById(
            input.userId,
            input.categoryId,
        );

        if (!category) throw new CategoryNotFoundError();

        if (!category.canBeRevomed()) {
            throw new SystemCategoryCannotBeRemovedError();
        }

        const canDelete = await this.categoryDeletionPolicy.canDelete(
            input.userId,
            category.id,
        );

        if (!canDelete) {
            category.deactivate();
            await this.categoryRepository.update(category);
            return;
        }

        await this.categoryRepository.deleteUserCategory(
            input.userId,
            category.id,
        );
    }
}
