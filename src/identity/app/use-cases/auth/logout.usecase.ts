import { IBaseUseCase } from '@/shared/app/contracts/base-usecase.contract';
import { Inject, Injectable } from '@nestjs/common';
import type { ISessionRepository } from '@/identity/domain/repositories/session-repository.interface';
import { IDENTITY_TOKENS } from '@/identity/identity.token';

type LogoutInput = { sessionId: string };

@Injectable()
export class LogoutUseCase implements IBaseUseCase<LogoutInput, void> {
    constructor(
        @Inject(IDENTITY_TOKENS.SESSION_REPOSITORY)
        private readonly sessionRepository: ISessionRepository,
    ) {}

    async execute(input: LogoutInput): Promise<void> {
        await this.sessionRepository.delete(input.sessionId);
    }
}
