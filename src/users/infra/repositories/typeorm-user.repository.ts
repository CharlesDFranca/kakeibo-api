import { UserEntity } from '@/database/entities/typeorm-user.entity';
import { User } from '@/users/domain/entities/user.entity';
import { IUserRepository } from '@/users/domain/repositories/user-repository.interface';
import { Email } from '@/users/domain/value-objects/email.vo';
import { Username } from '@/users/domain/value-objects/username.vo';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeormUserMapper } from '../mappers/typeorm-user.mapper';

@Injectable()
export class TypeormUserRepository implements IUserRepository {
    constructor(
        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>,
        private readonly mapper: TypeormUserMapper,
    ) {}

    async create(user: User): Promise<void> {
        const entity = this.mapper.toPersistence(user);
        await this.userRepository.save(entity);
    }

    async findById(id: string): Promise<User | null> {
        const user = await this.userRepository.findOne({ where: { id } });

        if (!user) return null;

        return this.mapper.toDomain(user);
    }

    async findByEmail(email: Email): Promise<User | null> {
        const user = await this.userRepository.findOne({
            where: { email: email.value },
        });

        if (!user) return null;

        return this.mapper.toDomain(user);
    }

    async findByUsername(username: Username): Promise<User | null> {
        const user = await this.userRepository.findOne({
            where: { username: username.value },
        });

        if (!user) return null;

        return this.mapper.toDomain(user);
    }

    async delete(id: string): Promise<void> {
        await this.userRepository.delete(id);
    }
}
