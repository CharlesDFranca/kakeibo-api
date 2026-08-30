import { NameCannotBeEmptyError } from '../errors/name-cannot-be-empty.error';
import { NameCannotExceedMaximumLengthError } from '../errors/name-cannot-exceed-maximum-length.error';

export class Name {
    constructor(private readonly _value: string) {
        const normalized = _value.trim();

        if (!normalized) throw new NameCannotBeEmptyError();

        if (normalized.length > 100) {
            throw new NameCannotExceedMaximumLengthError();
        }

        this._value = normalized;
    }

    public get value(): string {
        return this._value;
    }

    public equals(other: Name): boolean {
        return this.value === other.value;
    }
}
