import { Category } from '@/finance/categories/domain/entities/category.entity';
import { CategoryEntity } from '@/shared/infra/database/entities/typeorm-category.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
export class TypeOrmCategoryMapper {
    public toDomain(raw: CategoryEntity): Category {
        return new Category(
            raw.id,
            { name: raw.name },
            raw.createdAt,
            raw.updatedAt,
        );
    }

    public toPersistence(wallet: Category): CategoryEntity {
        const categoryEntity = new CategoryEntity();

        categoryEntity.id = wallet.id;
        categoryEntity.name = wallet.name;
        categoryEntity.createdAt = wallet.createdAt;
        categoryEntity.updatedAt = wallet.updatedAt;

        return categoryEntity;
    }
}
