import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    HttpStatus,
    Param,
    Patch,
    Post,
} from '@nestjs/common';
import { CreateGoalUseCase } from '../app/use-cases/create-goal.use-case';
import { CancelGoalUseCase } from '../app/use-cases/cancel-goal.use-case';
import { ListGoalsUseCase } from '../app/use-cases/list-goals.use-case';
import { RenameGoalUseCase } from '../app/use-cases/rename-goal.use-case';
import { CurrentUserId } from '@/identity/auth/presentation/decorators/current-user-id.decorator';

type CreateGoalInput = {
    userId: string;
    name: string;
    targetAmount: string;
    deadline?: Date | undefined;
};

@Controller('goals')
export class GoalsController {
    constructor(
        private readonly createGoalUseCase: CreateGoalUseCase,
        private readonly cancelGoalUseCase: CancelGoalUseCase,
        private readonly listGoalsUsecase: ListGoalsUseCase,
        private readonly renameGoalUseCase: RenameGoalUseCase,
    ) {}

    @Post()
    @HttpCode(HttpStatus.CREATED)
    async create(
        @CurrentUserId() userId: string,
        @Body() body: CreateGoalInput,
    ) {
        return this.createGoalUseCase.execute({
            ...body,
            userId,
            deadline: body.deadline ? new Date(body.deadline) : undefined,
        });
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    async delete(@CurrentUserId() userId: string, @Param('id') id: string) {
        return this.cancelGoalUseCase.execute({ userId, goalId: id });
    }

    @Get()
    @HttpCode(HttpStatus.OK)
    async list(@CurrentUserId() userId: string) {
        return this.listGoalsUsecase.execute({ userId });
    }

    @Patch(':id')
    @HttpCode(HttpStatus.OK)
    async rename(
        @CurrentUserId() userId: string,
        @Body() body: { name: string },
        @Param('id') id: string,
    ) {
        return this.renameGoalUseCase.execute({
            goalId: id,
            userId,
            name: body.name,
        });
    }
}
