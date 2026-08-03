import { Module } from '@nestjs/common';
import { NodeCryptoIDGeneratorService } from './infra/services/id-generator.service';
import { SHARED_TOKENS } from './shared.token';
import { BcryptPasswordHasher } from './infra/services/bcrypt-password-hasher.service';

@Module({
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
    exports: [SHARED_TOKENS.ID_GENERATOR, SHARED_TOKENS.PASSWORD_HASHER],
})
export class SharedModule {}
