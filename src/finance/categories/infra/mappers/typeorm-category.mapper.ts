import { Category } from '@/finance/categories/domain/entities/category.entity';
import { CategoryEntity } from '@/shared/infra/database/entities/typeorm-category.entity';

export class TypeOrmCategoryMapper {
    private constructor() {}

    public static toDomain(raw: CategoryEntity): Category {
        return new Category(
            raw.id,
            { name: raw.name, userId: raw.userId },
            raw.createdAt,
            raw.updatedAt,
        );
    }

    public static toPersistence(category: Category): CategoryEntity {
        const categoryEntity = new CategoryEntity();

        categoryEntity.id = category.id;
        categoryEntity.name = category.name;
        categoryEntity.userId = category.userId;
        categoryEntity.createdAt = category.createdAt;
        categoryEntity.updatedAt = category.updatedAt;

        return categoryEntity;
    }
}
