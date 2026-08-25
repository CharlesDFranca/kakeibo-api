import { CurrentUserId } from '@/identity/auth/presentation/decorators/current-user-id.decorator';
import {
    Controller,
    Post,
    HttpCode,
    HttpStatus,
    Body,
    Param,
} from '@nestjs/common';
import { RegisterGoalDepositUseCase } from '../app/use-cases/register-goal-deposit.use-case';

type RegisterGoalDepositDTO = {
    walletId: string;
    categoryId: string;
    movementType: string;
    amount: string;
};

@Controller('goals')
export class GoalMovementsController {
    constructor(
        private readonly registerGoalDeposit: RegisterGoalDepositUseCase,
    ) {}

    @Post(':id/movements')
    @HttpCode(HttpStatus.CREATED)
    async create(
        @CurrentUserId() userId: string,
        @Body() body: RegisterGoalDepositDTO,
        @Param('id') goalId: string,
    ) {
        return this.registerGoalDeposit.execute({
            userId,
            goalId,
            walletId: body.walletId,
            categoryId: body.categoryId,
            amount: body.amount,
        });
    }
}
