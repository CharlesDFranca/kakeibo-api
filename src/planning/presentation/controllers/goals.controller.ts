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
import { CreateGoalUseCase } from '../../app/use-cases/goals/create-goal.usecase';
import { CancelGoalUseCase } from '../../app/use-cases/goals/cancel-goal.usecase';
import { ListGoalsUseCase } from '../../app/use-cases/goals/list-goals.usecase';
import { RenameGoalUseCase } from '../../app/use-cases/goals/rename-goal.usecase';
import { CurrentUserId } from '@/core/decorators/current-user-id.decorator';
import { FindGoalByIdUseCase } from '../../app/use-cases/goals/find-goal-by-id.usecase';
import { CreateGoalDto } from '../dtos/create-goal.dto';
import { CancelGoalDto } from '../dtos/cancel-goal.dto';
import { RenameGoalDto } from '../dtos/rename-goal.dto';

@Controller('goals')
export class GoalsController {
    constructor(
        private readonly createGoalUseCase: CreateGoalUseCase,
        private readonly cancelGoalUseCase: CancelGoalUseCase,
        private readonly listGoalsUsecase: ListGoalsUseCase,
        private readonly renameGoalUseCase: RenameGoalUseCase,
        private readonly findGoalByIdUseCase: FindGoalByIdUseCase,
    ) {}

    @Post()
    @HttpCode(HttpStatus.CREATED)
    async create(@CurrentUserId() userId: string, @Body() body: CreateGoalDto) {
        return this.createGoalUseCase.execute({
            ...body,
            userId,
            deadline: body.deadline ? new Date(body.deadline) : undefined,
        });
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    async delete(
        @CurrentUserId() userId: string,
        @Param('id') id: string,
        @Body() body: CancelGoalDto,
    ) {
        return this.cancelGoalUseCase.execute({
            userId,
            goalId: id,
            categoryId: body.categoryId,
        });
    }

    @Get(':id')
    @HttpCode(HttpStatus.OK)
    async findById(@CurrentUserId() userId: string, @Param('id') id: string) {
        return this.findGoalByIdUseCase.execute({ userId, goalId: id });
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
        @Body() body: RenameGoalDto,
        @Param('id') id: string,
    ) {
        return this.renameGoalUseCase.execute({
            goalId: id,
            userId,
            name: body.name,
        });
    }
}
