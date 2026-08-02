import { Module } from '@nestjs/common';
import { NodeCryptoIDGeneratorService } from './infra/services/id-generator.service';
import { SHARED_TOKENS } from './shared.token';

@Module({
    providers: [
        {
            provide: SHARED_TOKENS.ID_GENERATOR,
            useClass: NodeCryptoIDGeneratorService,
        },
    ],
    exports: [SHARED_TOKENS.ID_GENERATOR],
})
export class SharedModule {}
