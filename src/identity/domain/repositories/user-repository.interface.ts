import { User } from '../entities/user.entity';
import { Email } from '../value-objects/email.vo';
import { Username } from '../value-objects/username.vo';

export interface IUserRepository {
    create(user: User): Promise<void>;
    findById(id: string): Promise<User | null>;
    findByEmail(email: Email): Promise<User | null>;
    findByUsername(username: Username): Promise<User | null>;
    delete(id: string): Promise<void>;
}
