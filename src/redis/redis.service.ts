import {
    Injectable,
    Logger,
    OnModuleDestroy,
    OnModuleInit,
} from '@nestjs/common';
import Redis, { Redis as RedisType } from 'ioredis';

@Injectable()
export class RedisService implements OnModuleDestroy, OnModuleInit {
    private client: RedisType;
    private readonly logger = new Logger(RedisService.name);

    constructor() {
        this.client = new Redis({
            host: process.env.REDIS_HOST,
            port: Number(process.env.REDIS_PORT),
            username: process.env.REDIS_USERNAME,
            password: process.env.REDIS_PASSWORD,
        });
    }

    async get<T>(key: string): Promise<T | null> {
        const data = await this.client.get(key);

        if (!data) return null;

        try {
            return JSON.parse(data) as T;
        } catch {
            return null;
        }
    }

    async set<T>(key: string, value: T, ttlSeconds?: number): Promise<void> {
        const data = JSON.stringify(value);
        if (ttlSeconds) {
            await this.client.set(key, data, 'EX', ttlSeconds);
        } else {
            await this.client.set(key, data);
        }
    }

    async del(key: string): Promise<void> {
        await this.client.del(key);
    }

    async onModuleDestroy(): Promise<void> {
        await this.client.quit();
    }

    async onModuleInit(): Promise<void> {
        const pong = await this.client.ping();
        this.logger.log(`Connected to Redis (${pong})`);
    }
}
