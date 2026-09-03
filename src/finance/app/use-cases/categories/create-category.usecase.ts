import { Category } from '@/finance/domain/entities/category.entity';
import { FINANCE_TOKENS } from '@/finance/finance.tokens';
import { IBaseUseCase } from '@/shared/app/contracts/base-usecase.contract';
import type { IIDGenerator } from '@/core/app/contracts/id-generator.contract';
import { Inject, Injectable } from '@nestjs/common';
import type { ICategoryRepository } from '../../../domain/repositories/category-repository.interface';
import { Name } from '@/shared/domain/value-objects/name.vo';
import { CategoryAlreadyExistsError } from '../../errors/category-already-exists.error';
import { CORE_TOKENS } from '@/core/core.tokens';

type CreateCategoryInput = {
    name: string;
    userId: string;
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
        @Inject(CORE_TOKENS.ID_GENERATOR)
        private readonly idGenerator: IIDGenerator,
    ) {}

    async execute(input: CreateCategoryInput): Promise<CreateCategoryOutput> {
        const existsByName =
            await this.categoryRepository.findUserCategoryByName(
                input.userId,
                input.name,
            );

        if (existsByName) throw new CategoryAlreadyExistsError();

        const now = new Date();

        const category = new Category(
            this.idGenerator.generate(),
            {
                name: new Name(input.name),
                userId: input.userId,
                isSystem: false,
                isActive: true,
            },
            now,
            now,
        );

        await this.categoryRepository.create(category);

        return { id: category.id };
    }
}
