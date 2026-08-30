import { AuthContext } from '@/identity/app/types/auth-context.type';

declare global {
    namespace Express {
        interface Request {
            auth: AuthContext;
        }
    }
}

export {};
