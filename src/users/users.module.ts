import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { CreateUserUseCase } from './app/use-cases/create-user.usecase';

@Module({
    controllers: [UsersController],
    providers: [CreateUserUseCase],
})
export class UsersModule {}
