import {
    Body,
    Controller,
    HttpCode,
    HttpStatus,
    Param,
    Post,
    Req,
    Res,
} from '@nestjs/common';
import { LoginUseCase } from '../../app/use-cases/login.usecase';
import { LogoutUseCase } from '../../app/use-cases/logout.usecase';
import type { Request, Response } from 'express';

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
        @Req() request: Request,
        @Res({ passthrough: true }) response: Response,
    ) {
        const sessionId = request.cookies.session;

        if (sessionId) {
            await this.logoutUseCase.execute({ sessionId });
        }

        response.clearCookie('session');
    }
}
