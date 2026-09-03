export interface ICategoryDeletionPolicy {
    canDelete(userId: string, categoryId: string): Promise<boolean>;
}
