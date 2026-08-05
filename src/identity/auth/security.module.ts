import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { SessionGuard } from './presentation/guards/session.guards';
import { AuthModule } from './auth.module';

@Module({
    imports: [AuthModule],
    providers: [
        SessionGuard,
        {
            provide: APP_GUARD,
            useExisting: SessionGuard,
        },
    ],
    exports: [],
})
export class SecurityModule {}
