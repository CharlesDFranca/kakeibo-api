import { Module } from '@nestjs/common';
import { DatabaseModule } from './infra/database/database.module';
import { RedisModule } from './infra/redis/redis.module';
import { CORE_TOKENS } from './core.tokens';
import { NodeCryptoIDGeneratorService } from './infra/services/id-generator.service';

@Module({
    imports: [DatabaseModule, RedisModule],
    providers: [
        {
            provide: CORE_TOKENS.ID_GENERATOR,
            useClass: NodeCryptoIDGeneratorService,
        },
    ],
    exports: [RedisModule, CORE_TOKENS.ID_GENERATOR],
})
export class CoreModule {}
