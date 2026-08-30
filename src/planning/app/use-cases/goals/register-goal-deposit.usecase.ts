import { IBaseUseCase } from '@/shared/app/contracts/base-usecase.contract';
import { Inject, Injectable } from '@nestjs/common';
import { Money } from '@/shared/domain/value-objects/money.vo';
import type { IIDGenerator } from '@/core/app/contracts/id-generator.contract';
import { CORE_TOKENS } from '@/core/core.tokens';
import { GoalMovement } from '@/planning/domain/entities/goal-movement.entity';
import { EGoalMovementType } from '@/planning/domain/enums/goal-movement-type.enum';
import { GoalMovementType } from '@/planning/domain/value-objects/goal-movement-type.vo';
import { GoalNotFoundError } from '../../errors/goal-not-found.error';
import { FINANCE_TOKENS } from '@/finance/finance.tokens';
import { PLANNING_TOKENS } from '@/planning/planning.tokens';
import type { IPlanningUnitOfWork } from '../../contracts/planning-unit-of-work.contract';

import type { IFinanceFacade } from '@/finance/app/contracts/fincance-facade.contract';

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
            const goalRepo = this.planningUow.getGoalRepository();
            const goalMovementRepo =
                this.planningUow.getGoalMovementRepository();

            const goal = await goalRepo.findUserGoalById(
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

            const goalMovement = new GoalMovement(
                this.idGenerator.generate(),
                {
                    amount: contribution,
                    goalId: goal.id,
                    walletId: input.walletId,
                    type: new GoalMovementType(EGoalMovementType.DEPOSIT),
                },
                new Date(),
                new Date(),
            );

            await goalRepo.update(goal);
            await goalMovementRepo.create(goalMovement);

            return { id: goalMovement.id };
        });
    }
}
