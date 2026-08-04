import { Module } from '@nestjs/common';
import { RedisSessionMapper } from './infra/mappers/redis-session.mapper';
import { RedisSessionRepository } from './infra/repositories/redis-session.repository';
import { AUTH_TOKENS } from './auth.token';
import { SharedModule } from '@/shared/shared.module';
import { LoginUseCase } from './app/use-cases/login.usecase';
import { UsersModule } from '../users/users.module';

@Module({
    imports: [SharedModule, UsersModule],
    providers: [
        LoginUseCase,
        {
            provide: AUTH_TOKENS.SESSION_REPOSITORY,
            useClass: RedisSessionRepository,
        },
        RedisSessionMapper,
    ],
})
export class AuthModule {}
