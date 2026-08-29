import { IBaseUseCase } from '@/shared/app/contracts/base-usecase.contract';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import type { IUnitOfWork } from '@/shared/app/contracts/unit-of-work.contract';
import { Money } from '@/shared/domain/value-objects/money.vo';
import { SHARED_TOKENS } from '@/shared/shared.token';

type CancelGoalInput = {
    userId: string;
    goalId: string;
};

type CancelGoalOutput = void;

@Injectable()
export class CancelGoalUseCase implements IBaseUseCase<
    CancelGoalInput,
    CancelGoalOutput
> {
    constructor(
        @Inject(SHARED_TOKENS.UNIT_OF_WORK)
        private readonly uow: IUnitOfWork,
    ) {}

    async execute(input: CancelGoalInput): Promise<CancelGoalOutput> {
        return this.uow.transaction(async () => {
            const goalRepository = this.uow.getGoalRepository();
            const walletRepository = this.uow.getWalletRepository();
            const goalMovementRepository = this.uow.getGoalMovementRepository();

            const goal = await goalRepository.findUserGoalById(
                input.userId,
                input.goalId,
            );

            if (!goal) {
                throw new NotFoundException('Goal not found');
            }

            if (goal.isCompleted()) {
                throw new Error('Cannot cancel a completed goal');
            }

            const movements = await goalMovementRepository.findByGoalId(
                goal.id,
            );

            const walletAmounts = new Map<string, Money>();

            for (const movement of movements) {
                const currentAmount =
                    walletAmounts.get(movement.walletId) ?? Money.zero();

                const amount = movement.isDeposit()
                    ? currentAmount.add(movement.amount)
                    : currentAmount.subtract(movement.amount);

                walletAmounts.set(movement.walletId, amount);
            }

            for (const [walletId, amount] of walletAmounts) {
                if (amount.isZero()) continue;

                const wallet = await walletRepository.findUserWalletById(
                    input.userId,
                    walletId,
                );

                if (!wallet) {
                    throw new Error(
                        'Goal movement references a non-existent wallet',
                    );
                }

                wallet.deposit(amount);

                await walletRepository.update(wallet);
            }

            await goalMovementRepository.deleteByGoalId(goal.id);
            await goalRepository.deleteUserGoal(input.userId, goal.id);
        });
    }
}
