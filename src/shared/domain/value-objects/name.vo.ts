export class Name {
    constructor(private readonly _value: string) {
        const normalized = _value.trim();

        if (!normalized) {
            throw new Error('Name cannot be empty');
        }

        if (normalized.length > 100) {
            throw new Error('Name cannot exceed 100 characters');
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
