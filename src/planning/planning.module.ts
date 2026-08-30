import { Module } from '@nestjs/common';
import { PLANNING_TOKENS } from './planning.tokens';
import { GoalsController } from './presentation/goals.controller';
import {
    CreateGoalUseCase,
    RenameGoalUseCase,
    ListGoalsUseCase,
    RegisterGoalDepositUseCase,
    RevertGoalDepositUseCase,
    CancelGoalUseCase,
    FindGoalByIdUseCase,
} from './app/use-cases/goals';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GoalMovementsController } from './presentation/goal-movements.controller';
import { IdentityModule } from '@/identity/identity.module';
import { TypeOrmGoalMovementRepository } from './infra/repositories/typeorm-goal-movement.repository';
import { TypeOrmGoalRepository } from './infra/repositories/typeorm-goal.repository';
import { GoalMovementEntity } from './infra/entities/typeorm-goal-movement.entity';
import { GoalEntity } from './infra/entities/typeorm-goal.entity';
import { CoreModule } from '@/core/core.module';

@Module({
    imports: [
        CoreModule,
        IdentityModule,
        TypeOrmModule.forFeature([GoalEntity, GoalMovementEntity]),
    ],
    controllers: [GoalsController, GoalMovementsController],
    providers: [
        CreateGoalUseCase,
        RenameGoalUseCase,
        ListGoalsUseCase,
        RegisterGoalDepositUseCase,
        RevertGoalDepositUseCase,
        CancelGoalUseCase,
        FindGoalByIdUseCase,

        {
            provide: PLANNING_TOKENS.GOAL_REPOSITORY,
            useClass: TypeOrmGoalRepository,
        },
        {
            provide: PLANNING_TOKENS.GOAL_MOVEMENT_REPOSITORY,
            useClass: TypeOrmGoalMovementRepository,
        },
    ],
    exports: [
        PLANNING_TOKENS.GOAL_REPOSITORY,
        PLANNING_TOKENS.GOAL_MOVEMENT_REPOSITORY,
    ],
})
export class PlanningModule {}
