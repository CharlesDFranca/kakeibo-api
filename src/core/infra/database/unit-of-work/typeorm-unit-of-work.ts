import { ITransactionRepository } from '@/finance/domain/repositories/transaction-repository.interface';
import { IWalletRepository } from '@/finance/domain/repositories/wallet-repository.interface';
import { TransactionEntity } from '@/finance/infra/entities/typeorm-transaction.entity';
import { WalletEntity } from '@/finance/infra/entities/typeorm-wallet.entity';
import { TypeOrmTransactionRepository } from '@/finance/infra/repositories/typeorm-transaction.repository';
import { TypeOrmWalletRepository } from '@/finance/infra/repositories/typeorm-wallet.repository';
import { IGoalMovementRepository } from '@/planning/domain/repositories/goal-movement-repository.interface';
import { IGoalRepository } from '@/planning/domain/repositories/goal-repository.interface';
import { GoalMovementEntity } from '@/planning/infra/entities/typeorm-goal-movement.entity';
import { GoalEntity } from '@/planning/infra/entities/typeorm-goal.entity';
import { TypeOrmGoalMovementRepository } from '@/planning/infra/repositories/typeorm-goal-movement.repository';
import { TypeOrmGoalRepository } from '@/planning/infra/repositories/typeorm-goal.repository';
import { IUnitOfWork } from '@/shared/app/contracts/unit-of-work.contract';
import { Injectable, Scope } from '@nestjs/common';
import { QueryRunner, EntityManager, DataSource } from 'typeorm';
import { UnitOfWorkNotInitializedError } from '../../errors/unit-of-work-not-initialized.error';

@Injectable({ scope: Scope.REQUEST })
export class TypeOrmUnitOfWork implements IUnitOfWork {
    private queryRunner?: QueryRunner;
    private entityManager?: EntityManager;

    private walletRepository?: IWalletRepository;
    private goalRepository?: IGoalRepository;
    private transactionRepository?: ITransactionRepository;
    private goalMovementRepository?: IGoalMovementRepository;

    constructor(private readonly dataSource: DataSource) {}

    async transaction<T>(work: () => Promise<T>): Promise<T> {
        await this.begin();

        try {
            const result = await work();

            await this.commit();

            return result;
        } catch (error) {
            await this.rollback();

            throw error;
        } finally {
            await this.release();
        }
    }

    public getWalletRepository(): IWalletRepository {
        if (!this.walletRepository) {
            const repository = this.getManager().getRepository(WalletEntity);

            this.walletRepository = new TypeOrmWalletRepository(repository);
        }

        return this.walletRepository;
    }

    public getGoalRepository(): IGoalRepository {
        if (!this.goalRepository) {
            const repository = this.getManager().getRepository(GoalEntity);

            this.goalRepository = new TypeOrmGoalRepository(repository);
        }

        return this.goalRepository;
    }

    public getTransactionRepository(): ITransactionRepository {
        if (!this.transactionRepository) {
            const repository =
                this.getManager().getRepository(TransactionEntity);

            this.transactionRepository = new TypeOrmTransactionRepository(
                repository,
            );
        }

        return this.transactionRepository;
    }

    public getGoalMovementRepository(): IGoalMovementRepository {
        if (!this.goalMovementRepository) {
            const repository =
                this.getManager().getRepository(GoalMovementEntity);

            this.goalMovementRepository = new TypeOrmGoalMovementRepository(
                repository,
            );
        }

        return this.goalMovementRepository;
    }

    private async begin(): Promise<void> {
        this.queryRunner = this.dataSource.createQueryRunner();

        await this.queryRunner.connect();
        await this.queryRunner.startTransaction();

        this.entityManager = this.queryRunner.manager;
    }

    private async commit(): Promise<void> {
        if (!this.queryRunner) {
            throw new UnitOfWorkNotInitializedError();
        }

        await this.queryRunner.commitTransaction();
    }

    private async rollback(): Promise<void> {
        if (!this.queryRunner) {
            throw new UnitOfWorkNotInitializedError();
        }

        await this.queryRunner.rollbackTransaction();
    }

    private async release(): Promise<void> {
        if (!this.queryRunner) {
            return;
        }

        await this.queryRunner.release();

        this.queryRunner = undefined;
        this.entityManager = undefined;

        this.walletRepository = undefined;
        this.goalRepository = undefined;
        this.transactionRepository = undefined;
    }

    private getManager(): EntityManager {
        if (!this.entityManager) {
            throw new UnitOfWorkNotInitializedError();
        }

        return this.entityManager;
    }
}
