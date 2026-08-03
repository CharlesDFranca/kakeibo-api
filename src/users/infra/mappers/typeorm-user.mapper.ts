import { UserEntity } from '@/database/entities/typeorm-user.entity';
import { User } from '@/users/domain/entities/user.entity';
import { Email } from '@/users/domain/value-objects/email.vo';
import { Username } from '@/users/domain/value-objects/username.vo';

export class TypeormUserMapper {
    public toDomain(raw: UserEntity): User {
        return new User(
            raw.id,
            {
                name: raw.name,
                email: new Email(raw.email),
                username: new Username(raw.username),
                passwordHash: raw.passwordHash,
            },
            raw.createdAt,
            raw.updatedAt,
        );
    }

    public toPersistence(user: User): UserEntity {
        const entity = new UserEntity();

        entity.id = user.id;
        entity.name = user.name;
        entity.username = user.username.value;
        entity.email = user.email.value;
        entity.passwordHash = user.passwordHash;

        return entity;
    }
}
