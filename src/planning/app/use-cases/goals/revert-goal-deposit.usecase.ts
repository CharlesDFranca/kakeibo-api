import { Inject, Injectable } from '@nestjs/common';
import { IBaseUseCase } from '@/shared/app/contracts/base-usecase.contract';
import { CORE_TOKENS } from '@/core/core.tokens';
import { FINANCE_TOKENS } from '@/finance/finance.tokens';
import { PLANNING_TOKENS } from '@/planning/planning.tokens';

import type { IIDGenerator } from '@/core/app/contracts/id-generator.contract';
import type { IPlanningUnitOfWork } from '../../contracts/planning-unit-of-work.contract';

import { GoalMovement } from '@/planning/domain/entities/goal-movement.entity';
import { EGoalMovementType } from '@/planning/domain/enums/goal-movement-type.enum';
import { GoalMovementCannotBeRevertedError } from '@/planning/domain/errors/goal-movement-cannot-be-reverted.error';
import { GoalMovementType } from '@/planning/domain/value-objects/goal-movement-type.vo';
import { GoalDepositNotFoundError } from '../../errors/goal-deposit-not-found.error';
import { GoalNotFoundError } from '../../errors/goal-not-found.error';

import type { IFinanceFacade } from '@/finance/api/fincance-facade.contract';

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
        @Inject(PLANNING_TOKENS.UNIT_OF_WORK)
        private readonly planningUow: IPlanningUnitOfWork,
        @Inject(CORE_TOKENS.ID_GENERATOR)
        private readonly idGenerator: IIDGenerator,
        @Inject(FINANCE_TOKENS.FACADE)
        private readonly financeFacade: IFinanceFacade,
    ) {}

    async execute(
        input: RevertGoalDepositInput,
    ): Promise<RevertGoalDepositOutput> {
        return this.planningUow.transaction(async () => {
            const goalRepository = this.planningUow.getGoalRepository();
            const goalMovementRepository =
                this.planningUow.getGoalMovementRepository();

            const deposit = await goalMovementRepository.findById(
                input.depositId,
            );

            if (!deposit) throw new GoalDepositNotFoundError();

            if (!deposit.canRevert()) {
                throw new GoalMovementCannotBeRevertedError();
            }

            const goal = await goalRepository.findUserGoalById(
                input.userId,
                deposit.goalId,
            );
            if (!goal) throw new GoalNotFoundError();

            await this.financeFacade.depositToWallet({
                userId: input.userId,
                walletId: deposit.walletId,
                amount: deposit.amount,
                categoryId: input.categoryId,
                description: `Reversão de aporte da meta: ${goal.name}`,
                date: new Date(),
            });

            goal.withdraw(deposit.amount);

            const now = new Date();
            const withdrawMovement = new GoalMovement(
                this.idGenerator.generate(),
                {
                    amount: deposit.amount,
                    goalId: goal.id,
                    type: new GoalMovementType(EGoalMovementType.WITHDRAW),
                    walletId: deposit.walletId,
                    revertedDepositId: deposit.id,
                },
                now,
                now,
            );

            await goalRepository.update(goal);
            await goalMovementRepository.create(withdrawMovement);

            return {
                id: withdrawMovement.id,
            };
        });
    }
}
