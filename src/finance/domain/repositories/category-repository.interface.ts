import { Category } from '../entities/category.entity';
import { SystemCategory } from '../enums/system-categories.enum';

export interface ICategoryRepository {
    create(cateogory: Category): Promise<void>;
    createMany(categories: Category[]): Promise<void>;
    update(cateogry: Category): Promise<void>;
    findAllForUser(userId: string): Promise<Category[]>;
    findSystemCategory(
        userId: string,
        category: SystemCategory,
    ): Promise<Category | null>;
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
