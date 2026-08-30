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
import { TypeOrmPlanningUnitOfWork } from './infra/database/typeorm-planning.uow';
import { PlanningFacade } from './app/services/planning-facade';

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
        {
            provide: PLANNING_TOKENS.UNIT_OF_WORK,
            useClass: TypeOrmPlanningUnitOfWork,
        },
        {
            provide: PLANNING_TOKENS.FACADE,
            useClass: PlanningFacade,
        },
    ],
    exports: [
        PLANNING_TOKENS.GOAL_REPOSITORY,
        PLANNING_TOKENS.GOAL_MOVEMENT_REPOSITORY,
        PLANNING_TOKENS.UNIT_OF_WORK,
        PLANNING_TOKENS.FACADE,
    ],
})
export class PlanningModule {}
