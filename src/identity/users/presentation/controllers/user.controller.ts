import {
    Body,
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    Param,
    Post,
} from '@nestjs/common';
import { CreateUserUseCase } from '../../app/use-cases/create-user.usecase';
import { FindUserByIdUseCase } from '../../app/use-cases/find-user-by-id.usecase';
import { Public } from '@/identity/auth/presentation/decorators/public-route.decorator';
import { CurrentUserId } from '@/identity/auth/presentation/decorators/current-user-id.decorator';

type CreateUserDTO = {
    name: string;
    username: string;
    email: string;
    password: string;
};

@Controller('users')
export class UsersController {
    constructor(
        private readonly createUserUseCase: CreateUserUseCase,
        private readonly findUserByIdUseCase: FindUserByIdUseCase,
    ) {}

    @Public()
    @Post()
    @HttpCode(HttpStatus.CREATED)
    async create(@Body() body: CreateUserDTO): Promise<{ id: string }> {
        return this.createUserUseCase.execute({
            name: body.name,
            username: body.username,
            email: body.email,
            password: body.password,
        });
    }

    @Get('me')
    @HttpCode(HttpStatus.OK)
    async findById(@CurrentUserId() id: string): Promise<{ id: string }> {
        return this.findUserByIdUseCase.execute({ id });
    }
}
