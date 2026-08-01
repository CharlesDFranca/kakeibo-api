import { ICategoryRepository } from '@/finance/domain/repositories/category-repository.interface';
import { IBaseUseCase } from '@/shared/app/contracts/base-usecase.contract';

type ListCategoriesInput = void;

type ListCategoriesOutput = {
    id: string;
    name: string;
}[];

export class ListCategoriesUseCase implements IBaseUseCase<
    ListCategoriesInput,
    ListCategoriesOutput
> {
    constructor(private readonly categoryRepository: ICategoryRepository) {}

    async execute(input: void): Promise<ListCategoriesOutput> {
        const categories = await this.categoryRepository.findAll();

        return categories.map((c) => {
            return { id: c.id, name: c.name };
        });
    }
}
