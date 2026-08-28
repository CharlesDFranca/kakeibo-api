import { Session } from '../entities/session.entity';

export interface ISessionRepository {
    save(session: Session): Promise<void>;
    findById(id: string): Promise<Session | null>;
    delete(id: string): Promise<void>;
}
