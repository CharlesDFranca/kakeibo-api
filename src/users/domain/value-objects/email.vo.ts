export class Email {
    private readonly _value: string;

    constructor(value: string) {
        const normalized = value.trim().toLowerCase();

        if (!Email.isValid(normalized)) {
            throw new Error('Invalid email');
        }

        this._value = normalized;
    }

    public get value(): string {
        return this._value;
    }

    public equals(other: Email): boolean {
        return this._value === other.value;
    }

    public toString(): string {
        return this._value;
    }

    private static isValid(email: string): boolean {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        return regex.test(email);
    }
}
