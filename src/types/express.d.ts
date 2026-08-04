import { AuthContext } from '@/identity/auth/app/types/auth-context.type';

declare global {
    namespace Express {
        interface Request {
            auth: AuthContext;
        }
    }
}

export {};
