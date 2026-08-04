import { Injectable } from '@nestjs/common';
import { Session } from '../../domain/entities/session.entity';

@Injectable()
export class RedisSessionMapper {
    public toPersistence(session: Session) {
        return {
            id: session.id,
            userId: session.userId,
            expiresAt: session.expiresAt.toISOString(),
        };
    }

    public toDomain(data: {
        id: string;
        userId: string;
        expiresAt: string;
    }): Session {
        return new Session(data.id, data.userId, new Date(data.expiresAt));
    }
}
