import type { ICategoryRepository } from '@/finance/domain/repositories/category-repository.interface';
import { FINANCE_TOKENS } from '@/finance/finance.tokens';
import { IBaseUseCase } from '@/shared/app/contracts/base-usecase.contract';
import { Inject, Injectable } from '@nestjs/common';

type ListCategoriesInput = void;

type ListCategoriesOutput = {
    id: string;
    name: string;
}[];

@Injectable()
export class ListCategoriesUseCase implements IBaseUseCase<
    ListCategoriesInput,
    ListCategoriesOutput
> {
    constructor(
        @Inject(FINANCE_TOKENS.CATEGORY_REPOSITORY)
        private readonly categoryRepository: ICategoryRepository,
    ) {}

    async execute(input: void): Promise<ListCategoriesOutput> {
        const categories = await this.categoryRepository.findAll();

        return categories.map((c) => {
            return { id: c.id, name: c.name };
        });
    }
}
