import type { IUserRepository } from '@/identity/users/domain/repositories/user-repository.interface';
import { IBaseUseCase } from '@/shared/app/contracts/base-usecase.contract';
import { Injectable, NotFoundException } from '@nestjs/common';
import type { IGoalRepository } from '../../domain/repositories/goal-repository.interface';
import { Goal } from '../../domain/entities/goal.entity';
import type { IIDGenerator } from '@/shared/app/contracts/id-generator.contract';
import { Money } from '@/shared/domain/value-objects/Money';
import { GoalStatus } from '../../domain/value-objects/goal-status.vo';
import { GoalDeadline } from '../../domain/value-objects/goal-deadline';
import { EGoalStatus } from '../../domain/enums/goal-status.enum';

type CreateGoalInput = {
    userId: string;
    name: string;
    status: EGoalStatus;
    targetAmount: string;
    deadline?: Date | undefined;
};

type CreateGoalOutput = { id: string };

@Injectable()
export class CreateGoalUseCase implements IBaseUseCase<
    CreateGoalInput,
    CreateGoalOutput
> {
    constructor(
        private readonly userRepository: IUserRepository,
        private readonly goalRepository: IGoalRepository,
        private readonly idGenerator: IIDGenerator,
    ) {}

    async execute(input: CreateGoalInput): Promise<CreateGoalOutput> {
        const user = await this.userRepository.findById(input.userId);

        if (!user) {
            throw new NotFoundException('User not found');
        }

        const now = new Date();

        const goal = new Goal(
            this.idGenerator.generate(),
            {
                userId: input.userId,
                currentAmount: Money.zero(),
                name: input.name,
                status: new GoalStatus(input.status),
                targetAmount: Money.fromAmount(input.targetAmount),
                deadline: input.deadline
                    ? new GoalDeadline(input.deadline, now)
                    : undefined,
            },
            now,
            now,
        );

        await this.goalRepository.create(goal);

        return { id: goal.id };
    }
}
