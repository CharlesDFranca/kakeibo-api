import { AuthContext } from '@/identity/app/contracts/auth-context.type';

declare global {
    namespace Express {
        interface Request {
            auth: AuthContext;
        }
    }
}

export {};
