import { Category } from '@/finance/categories/domain/entities/category.entity';
import { CategoryEntity } from '@/shared/infra/database/entities/typeorm-category.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
export class TypeOrmCategoryMapper {
    public toDomain(raw: CategoryEntity): Category {
        return new Category(
            raw.id,
            { name: raw.name, userId: raw.userId },
            raw.createdAt,
            raw.updatedAt,
        );
    }

    public toPersistence(category: Category): CategoryEntity {
        const categoryEntity = new CategoryEntity();

        categoryEntity.id = category.id;
        categoryEntity.name = category.name;
        categoryEntity.userId = category.userId;
        categoryEntity.createdAt = category.createdAt;
        categoryEntity.updatedAt = category.updatedAt;

        return categoryEntity;
    }
}
