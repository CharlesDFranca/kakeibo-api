import { CurrentUserId } from '@/core/decorators/current-user-id.decorator';

import {
    Body,
    Controller,
    HttpCode,
    HttpStatus,
    Param,
    Post,
} from '@nestjs/common';

import { RegisterGoalDepositUseCase } from '../../app/use-cases/goals/register-goal-deposit.usecase';
import { RevertGoalDepositUseCase } from '../../app/use-cases/goals/revert-goal-deposit.usecase';

type RegisterGoalDepositDTO = {
    walletId: string;
    categoryId: string;
    amount: string;
};

type RevertGoalDepositDTO = {
    categoryId: string;
};

@Controller('goals')
export class GoalMovementsController {
    constructor(
        private readonly registerGoalDeposit: RegisterGoalDepositUseCase,
        private readonly revertGoalDeposit: RevertGoalDepositUseCase,
    ) {}

    @Post(':id/movements')
    @HttpCode(HttpStatus.CREATED)
    async create(
        @CurrentUserId() userId: string,
        @Param('id') goalId: string,
        @Body() body: RegisterGoalDepositDTO,
    ) {
        return this.registerGoalDeposit.execute({
            userId,
            goalId,
            walletId: body.walletId,
            categoryId: body.categoryId,
            amount: body.amount,
        });
    }

    @Post(':id/movements/:movementId/revert')
    @HttpCode(HttpStatus.CREATED)
    async revert(
        @CurrentUserId() userId: string,
        @Param('movementId') depositId: string,
        @Body() body: RevertGoalDepositDTO,
    ) {
        return this.revertGoalDeposit.execute({
            userId,
            depositId,
            categoryId: body.categoryId,
        });
    }
}
