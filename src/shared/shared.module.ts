import { Module } from '@nestjs/common';
import { NodeCryptoIDGeneratorService } from '../core/infra/services/id-generator.service';
import { SHARED_TOKENS } from './shared.token';
import { DatabaseModule } from '../core/infra/database/database.module';
import { RedisModule } from '../core/infra/redis/redis.module';
import { TypeOrmUnitOfWork } from '../core/infra/database/unit-of-work/typeorm-unit-of-work';

@Module({
    imports: [DatabaseModule, RedisModule],
    providers: [
        {
            provide: SHARED_TOKENS.ID_GENERATOR,
            useClass: NodeCryptoIDGeneratorService,
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
        SHARED_TOKENS.UNIT_OF_WORK,
    ],
})
export class SharedModule {}
