import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SharedModule } from '@/shared/shared.module';
import { UserEntity } from '@/identity/infra/entities/typeorm-user.entity';

import { AuthController } from './presentation/controllers/auth.controller';
import { UsersController } from './presentation/controllers/user.controller';

import { LoginUseCase } from './app/use-cases/auth/login.usecase';
import { LogoutUseCase } from './app/use-cases/auth/logout.usecase';
import { CreateUserUseCase } from './app/use-cases/users/create-user.usecase';
import { FindUserByIdUseCase } from './app/use-cases/users/find-user-by-id.usecase';

import { TypeormUserRepository } from './infra/repositories/typeorm-user.repository';
import { RedisSessionRepository } from './infra/repositories/redis-session.repository';

import { AuthContextService } from './app/services/auth-context.service';
import { IDENTITY_TOKENS } from './identity.token';
import { APP_GUARD } from '@nestjs/core';
import { SessionGuard } from './presentation/guards/session.guard';
import { BcryptPasswordHasher } from './infra/services/bcrypt-password-hasher.service';

@Module({
    imports: [SharedModule, TypeOrmModule.forFeature([UserEntity])],
    controllers: [AuthController, UsersController],
    providers: [
        LoginUseCase,
        LogoutUseCase,
        CreateUserUseCase,
        FindUserByIdUseCase,

        AuthContextService,

        {
            provide: IDENTITY_TOKENS.USER_REPOSITORY,
            useClass: TypeormUserRepository,
        },
        {
            provide: IDENTITY_TOKENS.SESSION_REPOSITORY,
            useClass: RedisSessionRepository,
        },
        {
            provide: IDENTITY_TOKENS.PASSWORD_HASHER,
            useClass: BcryptPasswordHasher,
        },
        { provide: APP_GUARD, useClass: SessionGuard },
    ],
    exports: [
        IDENTITY_TOKENS.USER_REPOSITORY,
        IDENTITY_TOKENS.SESSION_REPOSITORY,
        IDENTITY_TOKENS.PASSWORD_HASHER,
        AuthContextService,
    ],
})
export class IdentityModule {}
