import { Inject, Injectable } from '@nestjs/common';
import { IBaseUseCase } from '@/shared/app/contracts/base-usecase.contract';
import { Money } from '@/shared/domain/value-objects/money.vo';
import { FINANCE_TOKENS } from '@/finance/finance.tokens';
import { PLANNING_TOKENS } from '@/planning/planning.tokens';

import type { IPlanningUnitOfWork } from '../../contracts/planning-unit-of-work.contract';
import { GoalNotFoundError } from '../../errors/goal-not-found.error';
import type { IFinanceFacade } from '@/finance/api/fincance-facade.contract';

type CancelGoalInput = {
    userId: string;
    goalId: string;
    categoryId: string;
};

type CancelGoalOutput = void;

@Injectable()
export class CancelGoalUseCase implements IBaseUseCase<
    CancelGoalInput,
    CancelGoalOutput
> {
    constructor(
        @Inject(PLANNING_TOKENS.UNIT_OF_WORK)
        private readonly planningUow: IPlanningUnitOfWork,
        @Inject(FINANCE_TOKENS.FACADE)
        private readonly financeFacade: IFinanceFacade,
    ) {}

    async execute(input: CancelGoalInput): Promise<CancelGoalOutput> {
        return this.planningUow.transaction(async () => {
            const goalRepository = this.planningUow.getGoalRepository();
            const goalMovementRepository =
                this.planningUow.getGoalMovementRepository();

            const goal = await goalRepository.findUserGoalById(
                input.userId,
                input.goalId,
            );

            if (!goal) throw new GoalNotFoundError();

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
                if (amount.isZero() || amount.isLessThan(Money.zero()))
                    continue;

                await this.financeFacade.depositToWallet({
                    userId: input.userId,
                    walletId,
                    amount,
                    categoryId: input.categoryId,
                    description: `Estorno por cancelamento da meta: ${goal.name}`,
                    date: new Date(),
                });
            }

            await goalMovementRepository.deleteByGoalId(goal.id);
            await goalRepository.deleteUserGoal(input.userId, goal.id);
        });
    }
}
