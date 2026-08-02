import { BaseEntity } from '@/shared/domain/entities/base-entity.entity';
import { Email } from '../value-objects/email.vo';

type UserProps = {
    name: string;
    email: Email;
    passwordHash: string;
};

export class User extends BaseEntity<UserProps> {
    constructor(
        id: string,
        props: UserProps,
        createdAt: Date,
        updatedAt: Date,
    ) {
        super(id, { ...props, name: props.name.trim() }, createdAt, updatedAt);

        this.validateName(props.name);
        this.validatePasswordHash(props.passwordHash);
    }

    public get name(): string {
        return this.props.name;
    }

    public get email(): Email {
        return this.props.email;
    }

    public get passwordHash(): string {
        return this.props.passwordHash;
    }

    public rename(name: string): void {
        const normilized = name.trim();

        this.validateName(normilized);

        if (this.name !== normilized) {
            this.props.name = normilized;
            this.touch();
        }
    }

    public changeEmail(email: Email): void {
        if (!email.equals(this.props.email)) {
            this.props.email = email;
            this.touch();
        }
    }

    public changePassword(passwordHash: string): void {
        this.validatePasswordHash(passwordHash);

        if (this.passwordHash !== passwordHash) {
            this.props.passwordHash = passwordHash;
            this.touch();
        }
    }

    private validateName(name: string): void {
        if (!name || name.trim() === '')
            throw new Error('User name cannot be empty');

        if (name.trim().length < 3) throw new Error('Name too short [MIN: 3]');
    }

    private validatePasswordHash(passwordHash: string): void {
        if (!passwordHash || passwordHash.trim() === '')
            throw new Error('User passwordHash cannot be empty');
    }
}
