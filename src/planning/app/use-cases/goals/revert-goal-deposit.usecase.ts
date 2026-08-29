import { CORE_TOKENS } from '@/core/core.tokens';
import { WalletNotFoundError } from '@/finance/app/errors/wallet-not-found.error';
import { Transaction } from '@/finance/domain/entities/transaction.entity';
import { ETransactionType } from '@/finance/domain/enums/transaction-type.enum';
import { TransactionType } from '@/finance/domain/value-objects/transaction-type.vo';
import { GoalMovement } from '@/planning/domain/entities/goal-movement.entity';
import { EGoalMovementType } from '@/planning/domain/enums/goal-movement-type.enum';
import { GoalMovementCannotBeRevertedError } from '@/planning/domain/errors/goal-movement-cannot-be-reverted.error';
import { GoalMovementType } from '@/planning/domain/value-objects/goal-movement-type.vo';
import { IBaseUseCase } from '@/shared/app/contracts/base-usecase.contract';
import type { IIDGenerator } from '@/shared/app/contracts/id-generator.contract';
import type { IUnitOfWork } from '@/shared/app/contracts/unit-of-work.contract';
import { Injectable, Inject } from '@nestjs/common';
import { GoalDepositNotFoundError } from '../../errors/goal-deposit-not-found.error';
import { GoalNotFoundError } from '../../errors/goal-not-found.error';

type RevertGoalDepositInput = {
    userId: string;
    depositId: string;
    categoryId: string;
};

type RevertGoalDepositOutput = {
    id: string;
};

@Injectable()
export class RevertGoalDepositUseCase implements IBaseUseCase<
    RevertGoalDepositInput,
    RevertGoalDepositOutput
> {
    constructor(
        @Inject(CORE_TOKENS.UNIT_OF_WORK)
        private readonly uow: IUnitOfWork,
        @Inject(CORE_TOKENS.ID_GENERATOR)
        private readonly idGenerator: IIDGenerator,
    ) {}

    async execute(
        input: RevertGoalDepositInput,
    ): Promise<RevertGoalDepositOutput> {
        return this.uow.transaction(async () => {
            const goalRepository = this.uow.getGoalRepository();
            const walletRepository = this.uow.getWalletRepository();
            const goalMovementRepository = this.uow.getGoalMovementRepository();
            const transactionRepository = this.uow.getTransactionRepository();

            const deposit = await goalMovementRepository.findById(
                input.depositId,
            );

            if (!deposit) throw new GoalDepositNotFoundError();

            if (!deposit.canRevert()) {
                throw new GoalMovementCannotBeRevertedError();
            }

            const wallet = await walletRepository.findUserWalletById(
                input.userId,
                deposit.walletId,
            );

            if (!wallet) throw new WalletNotFoundError();

            const goal = await goalRepository.findUserGoalById(
                input.userId,
                deposit.goalId,
            );

            if (!goal) throw new GoalNotFoundError();

            const amount = deposit.amount;

            goal.withdraw(amount);
            wallet.deposit(amount);

            const now = new Date();

            const withdraw = new GoalMovement(
                this.idGenerator.generate(),
                {
                    amount: deposit.amount,
                    goalId: goal.id,
                    type: new GoalMovementType(EGoalMovementType.WITHDRAW),
                    walletId: wallet.id,
                    revertedDepositId: deposit.id,
                },
                now,
                now,
            );

            const transaction = new Transaction(
                this.idGenerator.generate(),
                {
                    amount,
                    categoryId: input.categoryId,
                    walletId: wallet.id,
                    date: now,
                    description: 'Goal deposit reversion',
                    type: new TransactionType(ETransactionType.TRANSFER),
                },
                now,
                now,
            );

            await goalRepository.update(goal);
            await walletRepository.update(wallet);
            await goalMovementRepository.create(withdraw);
            await transactionRepository.create(transaction);

            return {
                id: withdraw.id,
            };
        });
    }
}
