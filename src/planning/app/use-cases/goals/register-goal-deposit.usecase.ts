import { IBaseUseCase } from '@/shared/app/contracts/base-usecase.contract';
import { Inject, Injectable } from '@nestjs/common';
import type { IUnitOfWork } from '@/shared/app/contracts/unit-of-work.contract';
import { Money } from '@/shared/domain/value-objects/money.vo';
import type { IIDGenerator } from '@/shared/app/contracts/id-generator.contract';
import { Transaction } from '@/finance/domain/entities/transaction.entity';
import { TransactionType } from '@/finance/domain/value-objects/transaction-type.vo';
import { ETransactionType } from '@/finance/domain/enums/transaction-type.enum';
import { CORE_TOKENS } from '@/core/core.tokens';
import { WalletNotFoundError } from '@/finance/app/errors/wallet-not-found.error';
import { GoalMovement } from '@/planning/domain/entities/goal-movement.entity';
import { EGoalMovementType } from '@/planning/domain/enums/goal-movement-type.enum';
import { GoalMovementType } from '@/planning/domain/value-objects/goal-movement-type.vo';
import { GoalNotFoundError } from '../../errors/goal-not-found.error';

type RegisterGoalDepositInput = {
    userId: string;
    walletId: string;
    goalId: string;
    categoryId: string;
    amount: string;
};

type RegisterGoalDepositOutput = { id: string };

@Injectable()
export class RegisterGoalDepositUseCase implements IBaseUseCase<
    RegisterGoalDepositInput,
    RegisterGoalDepositOutput
> {
    constructor(
        @Inject(CORE_TOKENS.UNIT_OF_WORK)
        private readonly uow: IUnitOfWork,
        @Inject(CORE_TOKENS.ID_GENERATOR)
        private readonly idGenerator: IIDGenerator,
    ) {}

    async execute(
        input: RegisterGoalDepositInput,
    ): Promise<RegisterGoalDepositOutput> {
        return this.uow.transaction(async () => {
            const goalRepository = this.uow.getGoalRepository();
            const walletRepository = this.uow.getWalletRepository();
            const goalMovementRepository = this.uow.getGoalMovementRepository();
            const transactionRepository = this.uow.getTransactionRepository();

            const wallet = await walletRepository.findUserWalletById(
                input.userId,
                input.walletId,
            );

            if (!wallet) throw new WalletNotFoundError();

            const goal = await goalRepository.findUserGoalById(
                input.userId,
                input.goalId,
            );

            if (!goal) throw new GoalNotFoundError();

            const amount = Money.fromAmount(input.amount);
            const necessaryAmount = goal.necessaryToComplete();

            const contribution = amount.isGreaterThan(necessaryAmount)
                ? necessaryAmount
                : amount;

            wallet.withdraw(contribution);
            goal.contribute(contribution);

            const now = new Date();

            const goalMovement = new GoalMovement(
                this.idGenerator.generate(),
                {
                    amount: contribution,
                    goalId: goal.id,
                    walletId: wallet.id,
                    type: new GoalMovementType(EGoalMovementType.DEPOSIT),
                },
                now,
                now,
            );

            const transaction = new Transaction(
                this.idGenerator.generate(),
                {
                    amount: contribution,
                    categoryId: input.categoryId,
                    walletId: wallet.id,
                    date: now,
                    description: 'Goal deposit',
                    type: new TransactionType(ETransactionType.TRANSFER),
                },
                now,
                now,
            );

            await goalRepository.update(goal);
            await walletRepository.update(wallet);
            await transactionRepository.create(transaction);
            await goalMovementRepository.create(goalMovement);

            return { id: goalMovement.id };
        });
    }
}
