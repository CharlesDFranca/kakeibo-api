import { Module } from '@nestjs/common';
import { DatabaseModule } from './infra/database/database.module';
import { RedisModule } from './infra/redis/redis.module';
import { CORE_TOKENS } from './core.tokens';
import { NodeCryptoIDGeneratorService } from './infra/services/id-generator.service';
import { TypeOrmUnitOfWork } from './infra/database/unit-of-work/typeorm-unit-of-work';

@Module({
    imports: [DatabaseModule, RedisModule],
    providers: [
        {
            provide: CORE_TOKENS.ID_GENERATOR,
            useClass: NodeCryptoIDGeneratorService,
        },
        {
            provide: CORE_TOKENS.UNIT_OF_WORK,
            useClass: TypeOrmUnitOfWork,
        },
    ],
    exports: [
        DatabaseModule,
        RedisModule,
        CORE_TOKENS.ID_GENERATOR,
        CORE_TOKENS.UNIT_OF_WORK,
    ],
})
export class CoreModule {}
