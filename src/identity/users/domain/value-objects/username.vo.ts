export class Username {
    private readonly _value: string;

    constructor(value: string) {
        const normalized = value.trim().toLowerCase();

        if (!Username.isValid(normalized)) {
            throw new Error('Invalid username');
        }

        this._value = normalized;
    }

    public get value(): string {
        return this._value;
    }

    public equals(other: Username): boolean {
        return this._value === other.value;
    }

    private static isValid(username: string): boolean {
        if (username.length < 3 || username.length > 30) {
            return false;
        }

        return /^[a-z0-9_.]+$/.test(username);
    }
}
