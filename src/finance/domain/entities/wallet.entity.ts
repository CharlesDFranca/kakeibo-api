import { BaseEntity } from '@/shared/domain/entities/base-entity.entity';
import { Money } from '@/shared/domain/value-objects/Money';

type WalletProps = {
    userId: string;
    name: string;
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

        if (!props.name || props.name.trim() === '') {
            throw new Error('Wallet name cannot be empty');
        }
    }

    public get name(): string {
        return this.props.name;
    }

    public get balance(): Money {
        return this.props.balance;
    }

    public get userId(): string {
        return this.props.userId;
    }

    public rename(name: string): void {
        if (!name || name.trim() === '') {
            throw new Error('Wallet name cannot be empty');
        }

        this.props.name = name;
        this.touch();
    }

    public deposit(amount: Money): void {
        this.props.balance = this.balance.add(amount);
        this.touch();
    }

    public withdraw(amount: Money) {
        if (!this.canWithdraw(amount)) {
            throw new Error('Insufficient balance');
        }

        this.props.balance = this.balance.subtract(amount);
        this.touch();
    }

    public canWithdraw(amount: Money): boolean {
        return this.props.balance.isGreaterThanOrEqual(amount);
    }
}
