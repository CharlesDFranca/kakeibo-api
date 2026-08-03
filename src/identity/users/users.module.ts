import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { CreateUserUseCase } from './app/use-cases/create-user.usecase';
import { FindUserByIdUseCase } from './app/use-cases/find-user-by-id.usecase';
import { USER_TOKENS } from './user.token';
import { TypeormUserRepository } from './infra/repositories/typeorm-user.repository';
import { TypeormUserMapper } from './infra/mappers/typeorm-user.mapper';
import { SharedModule } from '@/shared/shared.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '@/shared/infra/database/entities/typeorm-user.entity';

@Module({
    imports: [SharedModule, TypeOrmModule.forFeature([UserEntity])],
    controllers: [UsersController],
    providers: [
        //#region usecases
        CreateUserUseCase,
        FindUserByIdUseCase,
        //#endregion

        //#region repositories
        {
            provide: USER_TOKENS.USER_REPOSITORY,
            useClass: TypeormUserRepository,
        },
        //#endregion

        //#region mappers
        TypeormUserMapper,
        //#endregion
    ],
})
export class UsersModule {}
