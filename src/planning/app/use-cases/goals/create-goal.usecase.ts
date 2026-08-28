import type { IUserRepository } from '@/identity/domain/repositories/user-repository.interface';
import { IBaseUseCase } from '@/shared/app/contracts/base-usecase.contract';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import type { IGoalRepository } from '../../../domain/repositories/goal-repository.interface';
import { Goal } from '../../../domain/entities/goal.entity';
import type { IIDGenerator } from '@/shared/app/contracts/id-generator.contract';
import { Money } from '@/shared/domain/value-objects/Money';
import { GoalStatus } from '../../../domain/value-objects/goal-status.vo';
import { GoalDeadline } from '../../../domain/value-objects/goal-deadline';
import { PLANNING_TOKENS } from '@/planning/planning.tokens';
import { SHARED_TOKENS } from '@/shared/shared.token';
import { EGoalStatus } from '../../../domain/enums/goal-status.enum';
import { IDENTITY_TOKENS } from '@/identity/identity.token';

type CreateGoalInput = {
    userId: string;
    name: string;
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
        @Inject(IDENTITY_TOKENS.USER_REPOSITORY)
        private readonly userRepository: IUserRepository,
        @Inject(PLANNING_TOKENS.GOAL_REPOSITORY)
        private readonly goalRepository: IGoalRepository,
        @Inject(SHARED_TOKENS.ID_GENERATOR)
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
                status: new GoalStatus(EGoalStatus.IN_PROGRESS),
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
