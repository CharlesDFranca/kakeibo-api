import { IBaseUseCase } from '@/shared/app/contracts/base-usecase.contract';
import type { ISessionRepository } from '../../domain/repository/session-repository.interface';
import { Inject, Injectable } from '@nestjs/common';
import { AUTH_TOKENS } from '../../auth.token';

type LogoutInput = { sessionId: string };

@Injectable()
export class LogoutUseCase implements IBaseUseCase<LogoutInput, void> {
    constructor(
        @Inject(AUTH_TOKENS.SESSION_REPOSITORY)
        private readonly sessionRepository: ISessionRepository,
    ) {}

    async execute(input: LogoutInput): Promise<void> {
        await this.sessionRepository.delete(input.sessionId);
    }
}
