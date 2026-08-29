import { Category } from '@/finance/domain/entities/category.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CategoryEntity } from '@/finance/infra/entities/typeorm-category.entity';
import { TypeOrmCategoryMapper } from '../mappers/typeorm-category.mapper';
import { ICategoryRepository } from '../../domain/repositories/category-repository.interface';

@Injectable()
export class TypeOrmCategoryRepository implements ICategoryRepository {
    constructor(
        @InjectRepository(CategoryEntity)
        private readonly categoryRepository: Repository<CategoryEntity>,
    ) {}

    async create(category: Category): Promise<void> {
        const entity = TypeOrmCategoryMapper.toPersistence(category);
        await this.categoryRepository.save(entity);
    }

    async update(category: Category): Promise<void> {
        const entity = TypeOrmCategoryMapper.toPersistence(category);
        await this.categoryRepository.save(entity);
    }

    async findAllForUser(userId: string): Promise<Category[]> {
        const categories = await this.categoryRepository.find({
            where: { userId },
        });

        return categories.map((c) => TypeOrmCategoryMapper.toDomain(c));
    }

    async findUserCategoryByName(
        userId: string,
        name: string,
    ): Promise<Category | null> {
        const category = await this.categoryRepository.findOne({
            where: { userId, id: name },
        });

        if (!category) return null;

        return TypeOrmCategoryMapper.toDomain(category);
    }

    async findUserCategoryById(
        userId: string,
        categoryId: string,
    ): Promise<Category | null> {
        const category = await this.categoryRepository.findOne({
            where: { userId, id: categoryId },
        });

        if (!category) return null;

        return TypeOrmCategoryMapper.toDomain(category);
    }

    async deleteUserCategory(
        userId: string,
        categoryId: string,
    ): Promise<void> {
        await this.categoryRepository.delete({ userId, id: categoryId });
    }
}
