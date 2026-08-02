import { Module } from '@nestjs/common';
import { NodeCryptoIDGeneratorService } from './infra/services/id-generator.service';

export const SHARED_TOKENS = {
    ID_GENERATOR: Symbol('ID_GENERATOR'),
};

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
