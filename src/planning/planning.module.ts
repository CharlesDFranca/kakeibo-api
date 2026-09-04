import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CoreModule } from '@/core/core.module';
import { FinanceModule } from '@/finance/finance.module';

import { PLANNING_TOKENS } from './planning.tokens';
import { GoalsController } from './presentation/controllers/goals.controller';
import { GoalMovementsController } from './presentation/controllers/goal-movements.controller';

import {
    CreateGoalUseCase,
    RenameGoalUseCase,
    ListGoalsUseCase,
    RegisterGoalDepositUseCase,
    RevertGoalDepositUseCase,
    CancelGoalUseCase,
    FindGoalByIdUseCase,
} from './app/use-cases/goals';

import { GoalEntity } from './infra/entities/typeorm-goal.entity';
import { GoalMovementEntity } from './infra/entities/typeorm-goal-movement.entity';
import { TypeOrmGoalRepository } from './infra/repositories/typeorm-goal.repository';
import { TypeOrmGoalMovementRepository } from './infra/repositories/typeorm-goal-movement.repository';
import { TypeOrmPlanningUnitOfWork } from './infra/database/typeorm-planning.uow';
import { PlanningFacade } from './app/services/planning-facade';

@Module({
    imports: [
        CoreModule,
        forwardRef(() => FinanceModule),
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
    exports: [PLANNING_TOKENS.FACADE],
})
export class PlanningModule {}
