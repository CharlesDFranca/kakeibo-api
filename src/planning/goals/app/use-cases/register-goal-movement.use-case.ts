import { IBaseUseCase } from '@/shared/app/contracts/base-usecase.contract';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import type { IUnitOfWork } from '@/shared/app/contracts/unit-of-work.contract';
import { Money } from '@/shared/domain/value-objects/Money';
import { GoalMovement } from '../../domain/entities/goal-movement.entity';
import type { IIDGenerator } from '@/shared/app/contracts/id-generator.contract';
import { Transaction } from '@/finance/transactions/domain/entities/transaction.entity';
import { TransactionType } from '@/finance/transactions/domain/value-objects/transaction-type.vo';
import { ETransactionType } from '@/finance/transactions/domain/enums/transaction-type.enum';
import { SHARED_TOKENS } from '@/shared/shared.token';
import { GoalMovementType } from '../../domain/value-objects/goal-movement-type.vo';
import { EGoalMovementType } from '../../domain/enums/goal-movement-type.enum';

type RegisterGoalMovementInput = {
    userId: string;
    walletId: string;
    goalId: string;
    categoryId: string;
    movementType: EGoalMovementType;
    amount: string;
};

type RegisterGoalMovementOutput = { id: string };

@Injectable()
export class RegisterGoalMovementUseCase implements IBaseUseCase<
    RegisterGoalMovementInput,
    RegisterGoalMovementOutput
> {
    constructor(
        @Inject(SHARED_TOKENS.UNIT_OF_WORK)
        private readonly uow: IUnitOfWork,
        @Inject(SHARED_TOKENS.ID_GENERATOR)
        private readonly idGenerator: IIDGenerator,
    ) {}

    async execute(
        input: RegisterGoalMovementInput,
    ): Promise<RegisterGoalMovementOutput> {
        return this.uow.transaction(async () => {
            const goalRepository = this.uow.getGoalRepository();
            const walletRepository = this.uow.getWalletRepository();
            const goalMovementRepository = this.uow.getGoalMovementRepository();
            const transactionRepository = this.uow.getTransactionRepository();

            const wallet = await walletRepository.findUserWalletById(
                input.userId,
                input.walletId,
            );

            if (!wallet) throw new NotFoundException('Wallet not found');

            const goal = await goalRepository.findUserGoalById(
                input.userId,
                input.goalId,
            );

            if (!goal) throw new NotFoundException('Goal not found');

            const amount = Money.fromAmount(input.amount);

            goal.contribute(amount);

            await goalRepository.update(goal);

            wallet.withdraw(amount);

            await walletRepository.update(wallet);

            const now = new Date();

            const goalMovement = new GoalMovement(
                this.idGenerator.generate(),
                {
                    amount: amount,
                    goalId: goal.id,
                    walletId: wallet.id,
                    type: new GoalMovementType(input.movementType),
                },
                now,
                now,
            );

            const transaction = new Transaction(
                this.idGenerator.generate(),
                {
                    amount: amount,
                    categoryId: input.categoryId,
                    walletId: wallet.id,
                    date: now,
                    description: 'Goal movement',
                    type: new TransactionType(ETransactionType.EXPENSE),
                },
                now,
                now,
            );

            await transactionRepository.create(transaction);
            await goalMovementRepository.create(goalMovement);

            return { id: goalMovement.id };
        });
    }
}
