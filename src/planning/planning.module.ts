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
} from './app/';
import { GoalMovementEntity } from '@/shared/infra/database/entities/typeorm-goal-movement.entity';
import { GoalEntity } from '@/shared/infra/database/entities/typeorm-goal.entity';
import { SharedModule } from '@/shared/shared.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmGoalRepository, TypeOrmGoalMovementRepository } from './infra';
import { GoalMovementsController } from './presentation/goal-movements.controller';
import { IdentityModule } from '@/identity/identity.module';

@Module({
    imports: [
        SharedModule,
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
