import { Module } from '@nestjs/common';
import { NodeCryptoIDGeneratorService } from './infra/services/id-generator.service';
import { SHARED_TOKENS } from './shared.token';
import { BcryptPasswordHasher } from './infra/services/bcrypt-password-hasher.service';
import { DatabaseModule } from './infra/database/database.module';
import { RedisModule } from './infra/redis/redis.module';
import { TypeOrmUnitOfWork } from './infra/database/unit-of-work/typeorm-unit-of-work';

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
        {
            provide: SHARED_TOKENS.UNIT_OF_WORK,
            useClass: TypeOrmUnitOfWork,
        },
    ],
    exports: [
        DatabaseModule,
        RedisModule,
        SHARED_TOKENS.ID_GENERATOR,
        SHARED_TOKENS.PASSWORD_HASHER,
        SHARED_TOKENS.UNIT_OF_WORK,
    ],
})
export class SharedModule {}
