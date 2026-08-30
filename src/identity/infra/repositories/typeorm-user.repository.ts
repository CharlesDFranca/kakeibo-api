import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeormUserMapper } from '../mappers/typeorm-user.mapper';
import { IUserRepository } from '../../domain/repositories/user-repository.interface';
import { User } from '../../domain/entities/user.entity';
import { Email } from '../../domain/value-objects/email.vo';
import { Username } from '../../domain/value-objects/username.vo';
import { UserEntity } from '@/identity/infra/entities/typeorm-user.entity';

@Injectable()
export class TypeormUserRepository implements IUserRepository {
    constructor(
        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>,
    ) {}

    async create(user: User): Promise<void> {
        const entity = TypeormUserMapper.toPersistence(user);
        await this.userRepository.save(entity);
    }

    async findById(id: string): Promise<User | null> {
        const user = await this.userRepository.findOne({ where: { id } });

        if (!user) return null;

        return TypeormUserMapper.toDomain(user);
    }

    async findByEmail(email: Email): Promise<User | null> {
        const user = await this.userRepository.findOne({
            where: { email: email.value },
        });

        if (!user) return null;

        return TypeormUserMapper.toDomain(user);
    }

    async findByUsername(username: Username): Promise<User | null> {
        const user = await this.userRepository.findOne({
            where: { username: username.value },
        });

        if (!user) return null;

        return TypeormUserMapper.toDomain(user);
    }

    async delete(id: string): Promise<void> {
        await this.userRepository.delete(id);
    }
}
