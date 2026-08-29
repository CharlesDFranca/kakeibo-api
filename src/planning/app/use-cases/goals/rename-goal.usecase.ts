import { IBaseUseCase } from '@/shared/app/contracts/base-usecase.contract';
import type { IGoalRepository } from '../../../domain/repositories/goal-repository.interface';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { PLANNING_TOKENS } from '@/planning/planning.tokens';
import { Name } from '@/shared/domain/value-objects/name.vo';
import { GoalNotFoundError } from '../../errors/goal-not-found.error';
import { GoalAlreadyExistsError } from '../../errors/goal-already-exists.error';

type RenameGoalInput = {
    userId: string;
    goalId: string;
    name: string;
};

type RenameGoalOutput = void;

@Injectable()
export class RenameGoalUseCase implements IBaseUseCase<
    RenameGoalInput,
    RenameGoalOutput
> {
    constructor(
        @Inject(PLANNING_TOKENS.GOAL_REPOSITORY)
        private readonly goalRepository: IGoalRepository,
    ) {}

    async execute(input: RenameGoalInput): Promise<void> {
        const goal = await this.goalRepository.findUserGoalById(
            input.userId,
            input.goalId,
        );

        if (!goal) throw new GoalNotFoundError();

        const name = new Name(input.name);

        if (!goal.name.equals(name)) {
            const exists = await this.goalRepository.findUserGoalByName(
                input.userId,
                name.value,
            );

            if (exists) throw new GoalAlreadyExistsError();
        }

        goal.rename(name);

        await this.goalRepository.update(goal);
    }
}
