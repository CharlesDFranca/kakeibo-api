import { CreateUserUseCase, FindUserByIdUseCase } from '@/identity/app';
import { CurrentUserId } from '@/shared/decorators/current-user-id.decorator';
import { Public } from '@/shared/decorators/public-route.decorator';
import {
    Controller,
    Post,
    HttpCode,
    HttpStatus,
    Body,
    Get,
} from '@nestjs/common';

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
