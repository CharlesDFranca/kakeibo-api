import { LoginUseCase, LogoutUseCase } from '@/identity/app';
import { CurrentSessionId } from '@/shared/decorators/current-session-id.decorator';
import { Public } from '@/shared/decorators/public-route.decorator';
import {
    Controller,
    Post,
    HttpCode,
    HttpStatus,
    Body,
    Res,
} from '@nestjs/common';
import type { Response } from 'express';

type LoginDTO = {
    email: string;
    password: string;
};

@Controller('auth')
export class AuthController {
    constructor(
        private readonly loginUseCase: LoginUseCase,
        private readonly logoutUseCase: LogoutUseCase,
    ) {}

    @Public()
    @Post('login')
    @HttpCode(HttpStatus.OK)
    async login(
        @Body() body: LoginDTO,
        @Res({ passthrough: true }) response: Response,
    ): Promise<void> {
        const { sessionId } = await this.loginUseCase.execute({
            email: body.email,
            password: body.password,
        });

        response.cookie('session', sessionId, {
            httpOnly: true,
            sameSite: 'lax',
        });
    }

    @Post('logout')
    @HttpCode(HttpStatus.NO_CONTENT)
    async logout(
        @CurrentSessionId() sessionId: string,
        @Res({ passthrough: true }) response: Response,
    ) {
        await this.logoutUseCase.execute({ sessionId });

        response.clearCookie('session');
    }
}
