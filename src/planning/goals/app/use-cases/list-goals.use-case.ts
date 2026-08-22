import { IBaseUseCase } from '@/shared/app/contracts/base-usecase.contract';
import type { IGoalRepository } from '../../domain/repositories/goal-repository.interface';
import { Injectable } from '@nestjs/common';

type ListGoalsInput = {
    userId: string;
};

type ListGoalsOutput = {
    goals: {
        id: string;
        name: string;
        currentAmount: string;
        targetAmount: string;
        deadline: string | null;
    }[];
};

@Injectable()
export class ListGoalsUseCase implements IBaseUseCase<
    ListGoalsInput,
    ListGoalsOutput
> {
    constructor(private readonly goalRepository: IGoalRepository) {}

    async execute(input: ListGoalsInput): Promise<ListGoalsOutput> {
        const goals = await this.goalRepository.findAllForUser(input.userId);

        return {
            goals: goals.map((goal) => ({
                id: goal.id,
                name: goal.name,
                currentAmount: goal.currentAmount.amount,
                targetAmount: goal.targetAmount.amount,
                deadline: goal.deadline?.date.toISOString() ?? null,
            })),
        };
    }
}
