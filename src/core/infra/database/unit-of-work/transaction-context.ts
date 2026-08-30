import { AsyncLocalStorage } from 'async_hooks';
import { EntityManager } from 'typeorm';

export class TransactionContext {
    private static readonly als = new AsyncLocalStorage<EntityManager>();

    public static run<T>(
        manager: EntityManager,
        work: () => Promise<T>,
    ): Promise<T> {
        return this.als.run(manager, work);
    }

    public static getManager(defaultManager: EntityManager): EntityManager {
        return this.als.getStore() || defaultManager;
    }
}
