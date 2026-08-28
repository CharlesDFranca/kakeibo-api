import { Module } from '@nestjs/common';
import { RedisSessionRepository } from './infra/repositories/redis-session.repository';
import { AUTH_TOKENS } from './auth.token';
import { SharedModule } from '@/shared/shared.module';
import { LoginUseCase } from './app/use-cases/login.usecase';
import { UsersModule } from '../users/users.module';
import { LogoutUseCase } from './app/use-cases/logout.usecase';
import { AuthController } from './presentation/controllers/auth.controller';
import { AuthContextService } from './app/services/auth-context.service';

@Module({
    imports: [SharedModule, UsersModule],
    controllers: [AuthController],
    providers: [
        LoginUseCase,
        LogoutUseCase,
        {
            provide: AUTH_TOKENS.SESSION_REPOSITORY,
            useClass: RedisSessionRepository,
        },

        AuthContextService,
    ],
    exports: [AuthContextService],
})
export class AuthModule {}
