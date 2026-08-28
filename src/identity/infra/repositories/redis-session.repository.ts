import { Injectable } from '@nestjs/common';
import { Session } from '../../domain/entities/session.entity';
import { RedisService } from '@/shared/infra/redis/redis.service';
import { RedisSessionMapper } from '../mappers/redis-session.mapper';
import { ISessionRepository } from '@/identity/domain/repositories/session-repository.interface';

@Injectable()
export class RedisSessionRepository implements ISessionRepository {
    constructor(private readonly redis: RedisService) {}

    async save(session: Session): Promise<void> {
        await this.redis.set(
            `session:${session.id}`,
            RedisSessionMapper.toPersistence(session),
            session.expiresAt.getTime() - Date.now(),
        );
    }

    async findById(id: string): Promise<Session | null> {
        const session = await this.redis.get<{
            id: string;
            userId: string;
            expiresAt: string;
        }>(`session:${id}`);

        if (!session) return null;

        return RedisSessionMapper.toDomain(session);
    }

    async delete(id: string): Promise<void> {
        await this.redis.del(`session:${id}`);
    }
}
