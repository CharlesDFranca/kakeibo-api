import { ITransactionRepository } from '@/finance/transactions/domain/repositories/transaction-repository.interface';
import { TypeOrmTransactionRepository } from '@/finance/transactions/infra/repositories/typeorm-transaction.repository';

import { IWalletRepository } from '@/finance/wallets/domain/repositories/wallet-repository.interface';
import { TypeOrmWalletRepository } from '@/finance/wallets/infra/repositories/typeorm-wallet.repository';

import { IGoalRepository } from '@/planning/goals/domain/repositories/goal-repository.interface';
import { TypeOrmGoalRepository } from '@/planning/goals/infra/repositories/typeorm-goal.repository';

import { IUnitOfWork } from '@/shared/app/contracts/unit-of-work.contract';

import { Injectable, Scope } from '@nestjs/common';
import { DataSource, EntityManager, QueryRunner } from 'typeorm';
import { GoalEntity } from '../entities/typeorm-goal.entity';
import { TransactionEntity } from '../entities/typeorm-transaction.entity';
import { WalletEntity } from '../entities/typeorm-wallet.entity';
import { IContributionRepository } from '@/planning/goals/domain/repositories/contribution-repository.interface';
import { ContributionEntity } from '../entities/typeorm-contribution.entity';
import { TypeOrmContributionRepository } from '@/planning/goals/infra/repositories/typeorm-contribution.repository';

@Injectable({ scope: Scope.REQUEST })
export class TypeOrmUnitOfWork implements IUnitOfWork {
    private queryRunner?: QueryRunner;
    private entityManager?: EntityManager;

    private walletRepository?: IWalletRepository;
    private goalRepository?: IGoalRepository;
    private transactionRepository?: ITransactionRepository;
    private contributionRepository?: IContributionRepository;

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

    public getContributionRepository(): IContributionRepository {
        if (!this.contributionRepository) {
            const repository =
                this.getManager().getRepository(ContributionEntity);

            this.contributionRepository = new TypeOrmContributionRepository(
                repository,
            );
        }

        return this.contributionRepository;
    }

    private async begin(): Promise<void> {
        this.queryRunner = this.dataSource.createQueryRunner();

        await this.queryRunner.connect();
        await this.queryRunner.startTransaction();

        this.entityManager = this.queryRunner.manager;
    }

    private async commit(): Promise<void> {
        if (!this.queryRunner) {
            throw new Error('Transaction not started');
        }

        await this.queryRunner.commitTransaction();
    }

    private async rollback(): Promise<void> {
        if (!this.queryRunner) {
            throw new Error('Transaction not started');
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
            throw new Error('Transaction not started');
        }

        return this.entityManager;
    }
}
