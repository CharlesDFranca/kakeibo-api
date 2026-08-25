import { Module } from '@nestjs/common';
import { GoalsController } from './presentation/goals.controller';
import { SharedModule } from '@/shared/shared.module';
import { CreateGoalUseCase } from './app/use-cases/create-goal.use-case';
import { RenameGoalUseCase } from './app/use-cases/rename-goal.use-case';
import { ListGoalsUseCase } from './app/use-cases/list-goals.use-case';
import { RegisterGoalDepositUseCase } from './app/use-cases/register-goal-deposit.use-case';
import { CancelGoalUseCase } from './app/use-cases/cancel-goal.use-case';
import { TypeOrmGoalRepository } from './infra/repositories/typeorm-goal.repository';
import { PLANNING_TOKENS } from '../planning.tokens';
import { TypeOrmGoalMovementRepository } from './infra/repositories/typeorm-goal-movement.repository';
import { UsersModule } from '@/identity/users/users.module';
import { GoalMovementEntity } from '@/shared/infra/database/entities/typeorm-goal-movement.entity';
import { GoalEntity } from '@/shared/infra/database/entities/typeorm-goal.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GoalMovementsController } from './presentation/goal-movements.controller';
import { FindGoalByIdUseCase } from './app/use-cases/find-goal-by-id.use-case';

@Module({
    imports: [
        SharedModule,
        UsersModule,
        TypeOrmModule.forFeature([GoalEntity, GoalMovementEntity]),
    ],
    controllers: [GoalsController, GoalMovementsController],
    providers: [
        CreateGoalUseCase,
        RenameGoalUseCase,
        ListGoalsUseCase,
        RegisterGoalDepositUseCase,
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
})
export class GoalsModule {}
