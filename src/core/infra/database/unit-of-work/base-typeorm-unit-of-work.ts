import { DataSource } from 'typeorm';
import { TransactionContext } from './transaction-context';

export abstract class BaseTypeOrmUnitOfWork {
    constructor(protected readonly dataSource: DataSource) {}

    async transaction<T>(work: () => Promise<T>): Promise<T> {
        const queryRunner = this.dataSource.createQueryRunner();

        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            const result = await TransactionContext.run(
                queryRunner.manager,
                async () => {
                    return await work();
                },
            );

            await queryRunner.commitTransaction();
            return result;
        } catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        } finally {
            await queryRunner.release();
        }
    }
}
