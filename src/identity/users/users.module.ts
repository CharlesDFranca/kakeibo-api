import { Module } from '@nestjs/common';
import { CreateUserUseCase } from './app/use-cases/create-user.usecase';
import { FindUserByIdUseCase } from './app/use-cases/find-user-by-id.usecase';
import { USER_TOKENS } from './user.token';
import { TypeormUserRepository } from './infra/repositories/typeorm-user.repository';
import { SharedModule } from '@/shared/shared.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '@/shared/infra/database/entities/typeorm-user.entity';
import { UsersController } from './presentation/controllers/user.controller';

@Module({
    imports: [SharedModule, TypeOrmModule.forFeature([UserEntity])],
    controllers: [UsersController],
    providers: [
        CreateUserUseCase,
        FindUserByIdUseCase,
        {
            provide: USER_TOKENS.USER_REPOSITORY,
            useClass: TypeormUserRepository,
        },
    ],
    exports: [USER_TOKENS.USER_REPOSITORY],
})
export class UsersModule {}
