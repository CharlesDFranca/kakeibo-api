import { Category } from 'finance/domain/entities/category.entity';
import { ICategoryRepository } from 'finance/domain/repositories/category-repository.interface';
import { IBaseUseCase } from 'shared/app/contracts/base-usecase.contract';
import { IIDGenerator } from 'shared/app/contracts/uuid-generator.contract';

type CreateCategoryInput = {
    name: string;
};

type CreateCategoryOutput = {
    id: string;
};

export class CreateCategoryUseCase implements IBaseUseCase<
    CreateCategoryInput,
    CreateCategoryOutput
> {
    constructor(
        private readonly categoryRepository: ICategoryRepository,
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
