import { Category } from '../../../categories/domain/entities/category.entity';

export interface ICategoryRepository {
    create(category: Category): Promise<void>;
    update(category: Category): Promise<void>;
    delete(id: string): Promise<void>;
    findById(id: string): Promise<Category | null>;
    findAll(): Promise<Category[]>;
    findByName(name: string): Promise<Category | null>;
}
