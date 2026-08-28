import { IBaseUseCase } from '@/shared/app/contracts/base-usecase.contract';
import {
    ConflictException,
    Inject,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import type { IUnitOfWork } from '@/shared/app/contracts/unit-of-work.contract';
import type { IIDGenerator } from '@/shared/app/contracts/id-generator.contract';
import { Transaction } from '@/finance/domain/entities/transaction.entity';
import { TransactionType } from '@/finance/domain/value-objects/transaction-type.vo';
import { ETransactionType } from '@/finance/domain/enums/transaction-type.enum';
import { SHARED_TOKENS } from '@/shared/shared.token';
import { GoalMovement } from '../../domain/entities/goal-movement.entity';
import { GoalMovementType } from '../../domain/value-objects/goal-movement-type.vo';
import { EGoalMovementType } from '../../domain/enums/goal-movement-type.enum';

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
        @Inject(SHARED_TOKENS.UNIT_OF_WORK)
        private readonly uow: IUnitOfWork,
        @Inject(SHARED_TOKENS.ID_GENERATOR)
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

            if (!deposit) throw new NotFoundException('Goal deposit not found');

            if (!deposit.canRevert()) {
                throw new ConflictException('Only deposits can be reverted');
            }

            const wallet = await walletRepository.findUserWalletById(
                input.userId,
                deposit.walletId,
            );

            if (!wallet) {
                throw new NotFoundException('Wallet not found');
            }

            const goal = await goalRepository.findUserGoalById(
                input.userId,
                deposit.goalId,
            );

            if (!goal) {
                throw new NotFoundException('Goal not found');
            }

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
