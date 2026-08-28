import { TypeOrmTransactionRepository } from '@/finance/infra/repositories/typeorm-transaction.repository';
import { TypeOrmWalletRepository } from '@/finance/infra/repositories/typeorm-wallet.repository';
import { TypeOrmGoalRepository } from '@/planning/infra/repositories/typeorm-goal.repository';

import { DataSource, EntityManager, QueryRunner } from 'typeorm';
import { GoalEntity } from '../entities/typeorm-goal.entity';
import { TransactionEntity } from '../entities/typeorm-transaction.entity';
import { WalletEntity } from '../entities/typeorm-wallet.entity';
import { TypeOrmUnitOfWork } from './typeorm-unit-of-work';

describe('TypeOrmUnitOfWork', () => {
    let sut: TypeOrmUnitOfWork;

    let dataSource: jest.Mocked<DataSource>;
    let queryRunner: jest.Mocked<QueryRunner>;
    let entityManager: jest.Mocked<EntityManager>;

    let walletRepository: object;
    let goalRepository: object;
    let transactionRepository: object;

    beforeEach(() => {
        walletRepository = {};
        goalRepository = {};
        transactionRepository = {};

        entityManager = {
            getRepository: jest.fn(),
        } as unknown as jest.Mocked<EntityManager>;

        entityManager.getRepository.mockImplementation((entity) => {
            if (entity === WalletEntity) {
                return walletRepository as never;
            }

            if (entity === GoalEntity) {
                return goalRepository as never;
            }

            if (entity === TransactionEntity) {
                return transactionRepository as never;
            }

            throw new Error('Unexpected entity');
        });

        queryRunner = {
            connect: jest.fn().mockResolvedValue(undefined),
            startTransaction: jest.fn().mockResolvedValue(undefined),
            commitTransaction: jest.fn().mockResolvedValue(undefined),
            rollbackTransaction: jest.fn().mockResolvedValue(undefined),
            release: jest.fn().mockResolvedValue(undefined),
            manager: entityManager,
        } as unknown as jest.Mocked<QueryRunner>;

        dataSource = {
            createQueryRunner: jest.fn().mockReturnValue(queryRunner),
        } as unknown as jest.Mocked<DataSource>;

        sut = new TypeOrmUnitOfWork(dataSource);
    });

    describe('transaction', () => {
        it('should start, commit and release the transaction', async () => {
            const work = jest.fn().mockResolvedValue('result');

            const result = await sut.transaction(work);

            expect(result).toBe('result');

            expect(dataSource.createQueryRunner).toHaveBeenCalledTimes(1);

            expect(queryRunner.connect).toHaveBeenCalledTimes(1);

            expect(queryRunner.startTransaction).toHaveBeenCalledTimes(1);

            expect(work).toHaveBeenCalledTimes(1);

            expect(queryRunner.commitTransaction).toHaveBeenCalledTimes(1);

            expect(queryRunner.rollbackTransaction).not.toHaveBeenCalled();

            expect(queryRunner.release).toHaveBeenCalledTimes(1);
        });

        it('should execute the work after starting the transaction', async () => {
            const calls: string[] = [];

            queryRunner.connect.mockImplementation(async () => {
                calls.push('connect');
            });

            queryRunner.startTransaction.mockImplementation(async () => {
                calls.push('startTransaction');
            });

            queryRunner.commitTransaction.mockImplementation(async () => {
                calls.push('commit');
            });

            queryRunner.release.mockImplementation(async () => {
                calls.push('release');
            });

            const work = jest.fn().mockImplementation(async () => {
                calls.push('work');
            });

            await sut.transaction(work);

            expect(calls).toEqual([
                'connect',
                'startTransaction',
                'work',
                'commit',
                'release',
            ]);
        });

        it('should rollback when the work throws', async () => {
            const error = new Error('Something went wrong');

            const work = jest.fn().mockRejectedValue(error);

            await expect(sut.transaction(work)).rejects.toThrow(error);

            expect(queryRunner.rollbackTransaction).toHaveBeenCalledTimes(1);

            expect(queryRunner.commitTransaction).not.toHaveBeenCalled();

            expect(queryRunner.release).toHaveBeenCalledTimes(1);
        });

        it('should release the query runner when the work throws', async () => {
            const work = jest
                .fn()
                .mockRejectedValue(new Error('Something went wrong'));

            await expect(sut.transaction(work)).rejects.toThrow();

            expect(queryRunner.release).toHaveBeenCalledTimes(1);
        });

        it('should return the value returned by the work', async () => {
            const expected = {
                id: '123',
                success: true,
            };

            const work = jest.fn().mockResolvedValue(expected);

            const result = await sut.transaction(work);

            expect(result).toBe(expected);
        });

        it('should not execute commit when the work throws', async () => {
            const work = jest.fn().mockRejectedValue(new Error('Failure'));

            await expect(sut.transaction(work)).rejects.toThrow();

            expect(queryRunner.commitTransaction).not.toHaveBeenCalled();
        });

        it('should not execute rollback when the work succeeds', async () => {
            const work = jest.fn().mockResolvedValue(undefined);

            await sut.transaction(work);

            expect(queryRunner.rollbackTransaction).not.toHaveBeenCalled();
        });
    });

    describe('repositories', () => {
        it('should return a wallet repository', async () => {
            let repository;

            await sut.transaction(async () => {
                repository = sut.getWalletRepository();
            });

            expect(repository).toBeInstanceOf(TypeOrmWalletRepository);

            expect(entityManager.getRepository).toHaveBeenCalledWith(
                WalletEntity,
            );
        });

        it('should return a goal repository', async () => {
            let repository;

            await sut.transaction(async () => {
                repository = sut.getGoalRepository();
            });

            expect(repository).toBeInstanceOf(TypeOrmGoalRepository);

            expect(entityManager.getRepository).toHaveBeenCalledWith(
                GoalEntity,
            );
        });

        it('should return a transaction repository', async () => {
            let repository;

            await sut.transaction(async () => {
                repository = sut.getTransactionRepository();
            });

            expect(repository).toBeInstanceOf(TypeOrmTransactionRepository);

            expect(entityManager.getRepository).toHaveBeenCalledWith(
                TransactionEntity,
            );
        });

        it('should use the transaction entity manager to create repositories', async () => {
            await sut.transaction(async () => {
                sut.getWalletRepository();
                sut.getGoalRepository();
                sut.getTransactionRepository();
            });

            expect(entityManager.getRepository).toHaveBeenCalledTimes(3);

            expect(entityManager.getRepository).toHaveBeenNthCalledWith(
                1,
                WalletEntity,
            );

            expect(entityManager.getRepository).toHaveBeenNthCalledWith(
                2,
                GoalEntity,
            );

            expect(entityManager.getRepository).toHaveBeenNthCalledWith(
                3,
                TransactionEntity,
            );
        });

        it('should cache the wallet repository', async () => {
            await sut.transaction(async () => {
                const first = sut.getWalletRepository();
                const second = sut.getWalletRepository();

                expect(first).toBe(second);
            });

            expect(entityManager.getRepository).toHaveBeenCalledTimes(1);
        });

        it('should cache the goal repository', async () => {
            await sut.transaction(async () => {
                const first = sut.getGoalRepository();
                const second = sut.getGoalRepository();

                expect(first).toBe(second);
            });

            expect(entityManager.getRepository).toHaveBeenCalledTimes(1);
        });

        it('should cache the transaction repository', async () => {
            await sut.transaction(async () => {
                const first = sut.getTransactionRepository();
                const second = sut.getTransactionRepository();

                expect(first).toBe(second);
            });

            expect(entityManager.getRepository).toHaveBeenCalledTimes(1);
        });

        it('should create new repositories in a new transaction', async () => {
            let firstRepository;
            let secondRepository;

            await sut.transaction(async () => {
                firstRepository = sut.getWalletRepository();
            });

            await sut.transaction(async () => {
                secondRepository = sut.getWalletRepository();
            });

            expect(firstRepository).not.toBe(secondRepository);

            expect(entityManager.getRepository).toHaveBeenCalledTimes(2);
        });
    });

    describe('transaction lifecycle', () => {
        it('should use the same entity manager for all repositories', async () => {
            await sut.transaction(async () => {
                sut.getWalletRepository();
                sut.getGoalRepository();
                sut.getTransactionRepository();
            });

            expect(queryRunner.manager).toBe(entityManager);

            expect(entityManager.getRepository).toHaveBeenCalledTimes(3);
        });

        it('should release the query runner after a successful transaction', async () => {
            await sut.transaction(async () => {});

            expect(queryRunner.release).toHaveBeenCalledTimes(1);
        });

        it('should release the query runner after a failed transaction', async () => {
            await expect(
                sut.transaction(async () => {
                    throw new Error('Failure');
                }),
            ).rejects.toThrow('Failure');

            expect(queryRunner.release).toHaveBeenCalledTimes(1);
        });
    });

    describe('transaction errors', () => {
        it('should propagate the commit error', async () => {
            const error = new Error('Commit failed');

            queryRunner.commitTransaction.mockRejectedValue(error);

            await expect(sut.transaction(async () => {})).rejects.toThrow(
                error,
            );

            expect(queryRunner.rollbackTransaction).toHaveBeenCalledTimes(1);

            expect(queryRunner.release).toHaveBeenCalledTimes(1);
        });

        it('should propagate the rollback error if rollback itself fails', async () => {
            const workError = new Error('Work failed');
            const rollbackError = new Error('Rollback failed');

            queryRunner.rollbackTransaction.mockRejectedValue(rollbackError);

            await expect(
                sut.transaction(async () => {
                    throw workError;
                }),
            ).rejects.toThrow(rollbackError);

            expect(queryRunner.release).toHaveBeenCalledTimes(1);
        });
    });

    describe('transaction initialization', () => {
        it('should create a new query runner for each transaction', async () => {
            const firstQueryRunner = queryRunner;

            const secondQueryRunner = {
                ...queryRunner,
                manager: entityManager,
            } as jest.Mocked<QueryRunner>;

            dataSource.createQueryRunner
                .mockReturnValueOnce(firstQueryRunner)
                .mockReturnValueOnce(secondQueryRunner);

            await sut.transaction(async () => {});
            await sut.transaction(async () => {});

            expect(dataSource.createQueryRunner).toHaveBeenCalledTimes(2);
        });

        it('should connect before starting the transaction', async () => {
            const calls: string[] = [];

            queryRunner.connect.mockImplementation(async () => {
                calls.push('connect');
            });

            queryRunner.startTransaction.mockImplementation(async () => {
                calls.push('startTransaction');
            });

            await sut.transaction(async () => {});

            expect(calls).toEqual(['connect', 'startTransaction']);
        });
    });

    describe('repository access without transaction', () => {
        it('should throw when accessing wallet repository without a transaction', () => {
            expect(() => sut.getWalletRepository()).toThrow(
                'Transaction not started',
            );
        });

        it('should throw when accessing goal repository without a transaction', () => {
            expect(() => sut.getGoalRepository()).toThrow(
                'Transaction not started',
            );
        });

        it('should throw when accessing transaction repository without a transaction', () => {
            expect(() => sut.getTransactionRepository()).toThrow(
                'Transaction not started',
            );
        });
    });

    describe('begin failure', () => {
        it('should propagate the connection error', async () => {
            const error = new Error('Connection failed');

            queryRunner.connect.mockRejectedValue(error);

            await expect(sut.transaction(async () => {})).rejects.toThrow(
                error,
            );

            expect(queryRunner.startTransaction).not.toHaveBeenCalled();

            expect(queryRunner.commitTransaction).not.toHaveBeenCalled();

            expect(queryRunner.rollbackTransaction).not.toHaveBeenCalled();

            expect(queryRunner.release).not.toHaveBeenCalled();
        });

        it('should propagate the start transaction error', async () => {
            const error = new Error('Start transaction failed');

            queryRunner.startTransaction.mockRejectedValue(error);

            await expect(sut.transaction(async () => {})).rejects.toThrow(
                error,
            );

            expect(queryRunner.connect).toHaveBeenCalledTimes(1);

            expect(queryRunner.commitTransaction).not.toHaveBeenCalled();

            expect(queryRunner.rollbackTransaction).not.toHaveBeenCalled();

            expect(queryRunner.release).not.toHaveBeenCalled();
        });
    });
});
