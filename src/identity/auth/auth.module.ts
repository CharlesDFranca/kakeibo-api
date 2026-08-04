import { Module } from '@nestjs/common';
import { RedisSessionMapper } from './infra/mappers/redis-session.mapper';
import { RedisSessionRepository } from './infra/repositories/redis-session.repository';
import { AUTH_TOKENS } from './auth.token';

@Module({
    providers: [RedisSessionRepository, RedisSessionMapper],
    exports: [AUTH_TOKENS.SESSION_REPOSITORY],
})
export class AuthModule {}
