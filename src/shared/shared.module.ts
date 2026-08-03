import { Module } from '@nestjs/common';
import { NodeCryptoIDGeneratorService } from './infra/services/id-generator.service';
import { SHARED_TOKENS } from './shared.token';
import { BcryptPasswordHasher } from './infra/services/bcrypt-password-hasher.service';
import { DatabaseModule } from './infra/database/database.module';
import { RedisModule } from './infra/redis/redis.module';

@Module({
    imports: [DatabaseModule, RedisModule],
    providers: [
        {
            provide: SHARED_TOKENS.ID_GENERATOR,
            useClass: NodeCryptoIDGeneratorService,
        },
        {
            provide: SHARED_TOKENS.PASSWORD_HASHER,
            useClass: BcryptPasswordHasher,
        },
    ],
    exports: [
        DatabaseModule,
        RedisModule,
        SHARED_TOKENS.ID_GENERATOR,
        SHARED_TOKENS.PASSWORD_HASHER,
    ],
})
export class SharedModule {}
