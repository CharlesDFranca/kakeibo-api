import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { CreateUserUseCase } from './app/use-cases/create-user.usecase';
import { FindUserByIdUseCase } from './app/use-cases/find-user-by-id.usecase';

@Module({
    controllers: [UsersController],
    providers: [CreateUserUseCase, FindUserByIdUseCase],
})
export class UsersModule {}
