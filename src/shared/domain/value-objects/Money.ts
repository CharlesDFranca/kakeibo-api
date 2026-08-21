import { Decimal } from 'decimal.js';

export class Money {
    private constructor(private readonly value: Decimal) {
        if (!value.isFinite()) {
            throw new Error('Money value must be finite');
        }

        if (value.isNegative()) {
            throw new Error('Money value cannot be negative');
        }

        if (value.decimalPlaces() > 2) {
            throw new Error('Money cannot have more than two decimal places');
        }
    }

    public static fromAmount(amount: string): Money {
        return new Money(new Decimal(amount));
    }

    public static fromCents(cents: bigint): Money {
        return new Money(new Decimal(cents.toString()).dividedBy(100));
    }

    public toCents(): number {
        return this.value.times(100).toNumber();
    }

    public static zero(): Money {
        return new Money(new Decimal(0));
    }

    public get amount(): string {
        return this.value.toFixed(2);
    }

    public add(other: Money): Money {
        return new Money(this.value.plus(other.value));
    }

    public subtract(other: Money): Money {
        const result = this.value.minus(other.value);

        if (result.isNegative()) {
            throw new Error('Money cannot have a negative value');
        }

        return new Money(result);
    }

    public isGreaterThan(other: Money): boolean {
        return this.value.greaterThan(other.value);
    }

    public isGreaterThanOrEqual(other: Money): boolean {
        return this.value.greaterThanOrEqualTo(other.value);
    }

    public isLessThan(other: Money): boolean {
        return this.value.lessThan(other.value);
    }

    public equals(other: Money): boolean {
        return this.value.equals(other.value);
    }

    public isZero(): boolean {
        return this.value.isZero();
    }
}
