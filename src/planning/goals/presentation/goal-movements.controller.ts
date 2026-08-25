import { CurrentUserId } from '@/identity/auth/presentation/decorators/current-user-id.decorator';
import { parseEnum } from '@/shared/utils/parse-enum';
import {
    Controller,
    Post,
    HttpCode,
    HttpStatus,
    Body,
    Param,
} from '@nestjs/common';
import { RegisterGoalMovementUseCase } from '../app/use-cases/register-goal-movement.use-case';
import { EGoalMovementType } from '../domain/enums/goal-movement-type.enum';

type RegisterGoalMovementDTO = {
    walletId: string;
    categoryId: string;
    movementType: string;
    amount: string;
};

@Controller('goals')
export class GoalMovementsController {
    constructor(
        private readonly registerGoalMovement: RegisterGoalMovementUseCase,
    ) {}

    @Post(':id/movements')
    @HttpCode(HttpStatus.CREATED)
    async create(
        @CurrentUserId() userId: string,
        @Body() body: RegisterGoalMovementDTO,
        @Param('id') goalId: string,
    ) {
        return this.registerGoalMovement.execute({
            userId,
            goalId,
            walletId: body.walletId,
            categoryId: body.categoryId,
            amount: body.amount,
            movementType: parseEnum(body.movementType, EGoalMovementType),
        });
    }
}
