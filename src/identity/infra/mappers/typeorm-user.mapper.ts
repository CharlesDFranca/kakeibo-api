import { Name } from '@/shared/domain/value-objects/name.vo';
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
                name: new Name(raw.name),
                email: new Email(raw.email),
                username: new Username(raw.username),
                password: raw.password,
            },
            raw.createdAt,
            raw.updatedAt,
        );
    }

    public static toPersistence(user: User): UserEntity {
        const entity = new UserEntity();

        entity.id = user.id;
        entity.name = user.name.value;
        entity.username = user.username.value;
        entity.email = user.email.value;
        entity.password = user.password;

        return entity;
    }
}
