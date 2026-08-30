import { Decimal } from 'decimal.js';
import { MoneyValueCannotBeNegativeError } from '../errors/money-value-cannot-be-negative.error';
import { MoneyValueMustBeFiniteError } from '../errors/money-value-must-be-finite.error';
import { MoneyCannotHaveMoreThanTwoDecimalPlacesError } from '../errors/money-cannot-have-more-than-two-decimal-place.error';

export class Money {
    private constructor(private readonly value: Decimal) {
        if (!value.isFinite()) {
            throw new MoneyValueMustBeFiniteError();
        }

        if (value.isNegative()) {
            throw new MoneyValueCannotBeNegativeError();
        }

        if (value.decimalPlaces() > 2) {
            throw new MoneyCannotHaveMoreThanTwoDecimalPlacesError();
        }
    }

    public static fromAmount(amount: string): Money {
        return new Money(new Decimal(amount));
    }

    public static fromCents(cents: number): Money {
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
            throw new MoneyValueCannotBeNegativeError();
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
