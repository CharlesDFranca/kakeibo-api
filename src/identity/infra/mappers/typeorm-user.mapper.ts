import { User } from '../../domain/entities/user.entity';
import { Email } from '../../domain/value-objects/email.vo';
import { Username } from '../../domain/value-objects/username.vo';
import { UserEntity } from '@/identity/infra/entities/typeorm-user.entity';

export class TypeormUserMapper {
    private constructor() {}

    public static toDomain(raw: UserEntity): User {
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

    public static toPersistence(user: User): UserEntity {
        const entity = new UserEntity();

        entity.id = user.id;
        entity.name = user.name;
        entity.username = user.username.value;
        entity.email = user.email.value;
        entity.passwordHash = user.passwordHash;

        return entity;
    }
}
