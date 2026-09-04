import { Inject, Injectable } from '@nestjs/common';
import { PLANNING_TOKENS } from '@/planning/planning.tokens';
import type { IPlanningUnitOfWork } from '@/planning/app/contracts/planning-unit-of-work.contract';
import {
    IPlanningFacade,
    HasWalletAllocatedToGoalsInput,
} from '../../api/planning-facade.api';

@Injectable()
export class PlanningFacade implements IPlanningFacade {
    constructor(
        @Inject(PLANNING_TOKENS.UNIT_OF_WORK)
        private readonly planningUow: IPlanningUnitOfWork,
    ) {}

    async hasWalletAllocatedToGoals(
        input: HasWalletAllocatedToGoalsInput,
    ): Promise<boolean> {
        const goalMovementRepo = this.planningUow.getGoalMovementRepository();

        return goalMovementRepo.hasAllocatedAmountFromWallet(
            input.userId,
            input.walletId,
        );
    }
}
