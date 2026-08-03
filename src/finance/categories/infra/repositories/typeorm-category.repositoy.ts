import { Category } from '@/finance/categories/domain/entities/category.entity';
import { ICategoryRepository } from '@/finance/domain/repositories/category-repository.interface';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CategoryEntity } from '@/shared/infra/database/entities/typeorm-category.entity';
import { TypeOrmCategoryMapper } from '../mappers/typeorm-category.mapper';

@Injectable()
export class TypeOrmCategoryRepository implements ICategoryRepository {
    constructor(
        @InjectRepository(CategoryEntity)
        private readonly categoryRepository: Repository<CategoryEntity>,
        private readonly mapper: TypeOrmCategoryMapper,
    ) {}

    async create(category: Category): Promise<void> {
        const entity = this.mapper.toPersistence(category);
        await this.categoryRepository.save(entity);
    }

    async update(category: Category): Promise<void> {
        const entity = this.mapper.toPersistence(category);
        await this.categoryRepository.save(entity);
    }

    async delete(id: string): Promise<void> {
        await this.categoryRepository.delete(id);
    }

    async findById(id: string): Promise<Category | null> {
        const category = await this.categoryRepository.findOne({
            where: { id },
        });

        if (!category) return null;

        return this.mapper.toDomain(category);
    }

    async findAll(): Promise<Category[]> {
        const categories = await this.categoryRepository.find();

        return categories.map((category) => this.mapper.toDomain(category));
    }

    async findByName(name: string): Promise<Category | null> {
        const category = await this.categoryRepository.findOne({
            where: { name },
        });

        if (!category) return null;

        return this.mapper.toDomain(category);
    }
}
