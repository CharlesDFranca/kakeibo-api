import { Category } from '../entities/category.entity';

export interface ICategoryRepository {
    create(cateogry: Category): Promise<void>;
    update(cateogry: Category): Promise<void>;
    findAllForUser(userId: string): Promise<Category[]>;
    findUserCategoryByName(
        userId: string,
        name: string,
    ): Promise<Category | null>;
    findUserCategoryById(
        userId: string,
        categoryId: string,
    ): Promise<Category | null>;
    deleteUserCategory(userId: string, categoryId: string): Promise<void>;
}
