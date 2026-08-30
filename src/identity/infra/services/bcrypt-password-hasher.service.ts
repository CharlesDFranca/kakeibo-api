import { IPasswordHasher } from '@/identity/app/contracts/password-hasher.contract';
import { Injectable } from '@nestjs/common';
import bcrypt from 'bcrypt';

@Injectable()
export class BcryptPasswordHasher implements IPasswordHasher {
    async hash(password: string): Promise<string> {
        return bcrypt.hash(password, 12);
    }

    async compare(password: string, hash: string): Promise<boolean> {
        return bcrypt.compare(password, hash);
    }
}
