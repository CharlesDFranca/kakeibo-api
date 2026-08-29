import { BaseEntity } from '@/shared/domain/entities/base-entity.entity';
import { Money } from '@/shared/domain/value-objects/money.vo';
import { Name } from '@/shared/domain/value-objects/name.vo';
import { InsufficientWalletBalanceError } from '../errors/insufficient-wallet-balance.error';

type WalletProps = {
    userId: string;
    name: Name;
    balance: Money;
};

export class Wallet extends BaseEntity<WalletProps> {
    constructor(
        id: string,
        props: WalletProps,
        createdAt: Date,
        updatedAt: Date,
    ) {
        super(id, props, createdAt, updatedAt);
    }

    public get name(): Name {
        return this.props.name;
    }

    public get balance(): Money {
        return this.props.balance;
    }

    public get userId(): string {
        return this.props.userId;
    }

    public rename(name: Name): void {
        if (this.name.equals(name)) return;

        this.props.name = name;
        this.touch();
    }

    public deposit(amount: Money): void {
        this.props.balance = this.balance.add(amount);
        this.touch();
    }

    public withdraw(amount: Money) {
        if (!this.canWithdraw(amount)) {
            throw new InsufficientWalletBalanceError();
        }

        this.props.balance = this.balance.subtract(amount);
        this.touch();
    }

    public canWithdraw(amount: Money): boolean {
        return this.props.balance.isGreaterThanOrEqual(amount);
    }
}
