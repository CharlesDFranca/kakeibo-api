import { IBaseUseCase } from '@/shared/app/contracts/base-usecase.contract';
import type { IGoalRepository } from '../../domain/repositories/goal-repository.interface';
import { Injectable, NotFoundException } from '@nestjs/common';

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
    constructor(private readonly goalRepository: IGoalRepository) {}

    async execute(input: RenameGoalInput): Promise<void> {
        const goal = await this.goalRepository.findUserGoalById(
            input.userId,
            input.goalId,
        );

        if (!goal) throw new NotFoundException('Goal not found');

        goal.rename(input.name);

        await this.goalRepository.update(goal);
    }
}
