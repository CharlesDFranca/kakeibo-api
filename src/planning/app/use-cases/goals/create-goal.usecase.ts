import type { IUserRepository } from '@/identity/domain/repositories/user-repository.interface';
import { IBaseUseCase } from '@/shared/app/contracts/base-usecase.contract';
import { IDENTITY_TOKENS } from '@/identity/identity.token';
import { Name } from '@/shared/domain/value-objects/name.vo';
import { UserNotFoundError } from '@/identity/app/errors/user-not-found.error';
import { CORE_TOKENS } from '@/core/core.tokens';
import { Inject, Injectable } from '@nestjs/common';
import { Goal } from '@/planning/domain/entities/goal.entity';
import { EGoalStatus } from '@/planning/domain/enums/goal-status.enum';
import type { IGoalRepository } from '@/planning/domain/repositories/goal-repository.interface';
import { GoalDeadline } from '@/planning/domain/value-objects/goal-deadline.vo';
import { GoalStatus } from '@/planning/domain/value-objects/goal-status.vo';
import { PLANNING_TOKENS } from '@/planning/planning.tokens';
import type { IIDGenerator } from '@/core/app/contracts/id-generator.contract';
import { Money } from '@/shared/domain/value-objects/money.vo';

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
        @Inject(CORE_TOKENS.ID_GENERATOR)
        private readonly idGenerator: IIDGenerator,
    ) {}

    async execute(input: CreateGoalInput): Promise<CreateGoalOutput> {
        const user = await this.userRepository.findById(input.userId);

        if (!user) {
            throw new UserNotFoundError();
        }

        const now = new Date();

        const goal = new Goal(
            this.idGenerator.generate(),
            {
                userId: input.userId,
                currentAmount: Money.zero(),
                name: new Name(input.name),
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
