import { Category } from '@/finance/domain/entities/category.entity';
import { CategoryEntity } from '@/finance/infra/entities/typeorm-category.entity';
import { Name } from '@/shared/domain/value-objects/name.vo';

export class TypeOrmCategoryMapper {
    private constructor() {}

    public static toDomain(raw: CategoryEntity): Category {
        return new Category(
            raw.id,
            { name: new Name(raw.name), userId: raw.userId },
            raw.createdAt,
            raw.updatedAt,
        );
    }

    public static toPersistence(category: Category): CategoryEntity {
        const categoryEntity = new CategoryEntity();

        categoryEntity.id = category.id;
        categoryEntity.name = category.name.value;
        categoryEntity.userId = category.userId;
        categoryEntity.createdAt = category.createdAt;
        categoryEntity.updatedAt = category.updatedAt;

        return categoryEntity;
    }
}
