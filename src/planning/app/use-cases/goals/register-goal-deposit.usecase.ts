import { Inject, Injectable } from '@nestjs/common';
import { IBaseUseCase } from '@/shared/app/contracts/base-usecase.contract';
import { Money } from '@/shared/domain/value-objects/money.vo';
import { CORE_TOKENS } from '@/core/core.tokens';
import { FINANCE_TOKENS } from '@/finance/finance.tokens';
import { PLANNING_TOKENS } from '@/planning/planning.tokens';

import type { IIDGenerator } from '@/core/app/contracts/id-generator.contract';
import type { IPlanningUnitOfWork } from '../../contracts/planning-unit-of-work.contract';

import { GoalMovement } from '@/planning/domain/entities/goal-movement.entity';
import { EGoalMovementType } from '@/planning/domain/enums/goal-movement-type.enum';
import { GoalMovementType } from '@/planning/domain/value-objects/goal-movement-type.vo';
import { GoalNotFoundError } from '../../errors/goal-not-found.error';

import type { IFinanceFacade } from '@/finance/api/fincance-facade.contract';

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
        @Inject(PLANNING_TOKENS.UNIT_OF_WORK)
        private readonly planningUow: IPlanningUnitOfWork,
        @Inject(CORE_TOKENS.ID_GENERATOR)
        private readonly idGenerator: IIDGenerator,
        @Inject(FINANCE_TOKENS.FACADE)
        private readonly financeFacade: IFinanceFacade,
    ) {}

    async execute(
        input: RegisterGoalDepositInput,
    ): Promise<RegisterGoalDepositOutput> {
        return this.planningUow.transaction(async () => {
            const goalRepository = this.planningUow.getGoalRepository();
            const goalMovementRepository =
                this.planningUow.getGoalMovementRepository();

            const goal = await goalRepository.findUserGoalById(
                input.userId,
                input.goalId,
            );
            if (!goal) throw new GoalNotFoundError();

            const amount = Money.fromAmount(input.amount);
            const necessary = goal.necessaryToComplete();
            const contribution = amount.isGreaterThan(necessary)
                ? necessary
                : amount;

            await this.financeFacade.withdrawFromWallet({
                userId: input.userId,
                walletId: input.walletId,
                amount: contribution,
                categoryId: input.categoryId,
                description: `Aporte na meta: ${goal.name}`,
                date: new Date(),
            });

            goal.contribute(contribution);

            const now = new Date();
            const goalMovement = new GoalMovement(
                this.idGenerator.generate(),
                {
                    amount: contribution,
                    goalId: goal.id,
                    walletId: input.walletId,
                    type: new GoalMovementType(EGoalMovementType.DEPOSIT),
                },
                now,
                now,
            );

            await goalRepository.update(goal);
            await goalMovementRepository.create(goalMovement);

            return { id: goalMovement.id };
        });
    }
}
