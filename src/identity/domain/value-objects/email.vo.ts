import { isEmail } from 'validator';
import { InvalidEmailError } from '../errors/invalid-email.error';

export class Email {
    constructor(private readonly _value: string) {
        const normalized = _value.trim().toLowerCase();

        if (!isEmail(normalized)) throw new InvalidEmailError();

        this._value = normalized;
    }

    public get value(): string {
        return this._value;
    }

    public equals(other: Email): boolean {
        return this._value === other.value;
    }
}
