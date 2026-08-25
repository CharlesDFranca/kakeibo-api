import { IBaseUseCase } from '@/shared/app/contracts/base-usecase.contract';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import type { IGoalRepository } from '../../domain/repositories/goal-repository.interface';
import type { IGoalMovementRepository } from '../../domain/repositories/goal-movement-repository.interface';
import type { IWalletRepository } from '@/finance/wallets/domain/repositories/wallet-repository.interface';
import { PLANNING_TOKENS } from '@/planning/planning.tokens';

type FindGoalByIdInput = {
    userId: string;
    goalId: string;
};

type FindGoalByIdOutput = {};

@Injectable()
export class FindGoalByIdUseCase implements IBaseUseCase<
    FindGoalByIdInput,
    FindGoalByIdOutput
> {
    constructor(
        @Inject(PLANNING_TOKENS.GOAL_REPOSITORY)
        private readonly goalRepository: IGoalRepository,
        @Inject(PLANNING_TOKENS.GOAL_MOVEMENT_REPOSITORY)
        private readonly goalMovementsRepository: IGoalMovementRepository,
    ) {}

    async execute(input: FindGoalByIdInput): Promise<FindGoalByIdOutput> {
        const goal = await this.goalRepository.findUserGoalById(
            input.userId,
            input.goalId,
        );

        if (!goal) throw new NotFoundException('Goal not found');

        const goalMovements = await this.goalMovementsRepository.findByGoalId(
            goal.id,
        );

        const movements = goalMovements.map((goalMovement) => ({
            type: goalMovement.type.value,
            amount: goalMovement.amount.amount,
            walletId: goalMovement.walletId,
        }));

        return {
            goalId: goal.id,
            name: goal.name,
            status: goal.status.value,
            targetAmount: goal.targetAmount.amount,
            currentAmount: goal.currentAmount.amount,
            movements,
        };
    }
}
