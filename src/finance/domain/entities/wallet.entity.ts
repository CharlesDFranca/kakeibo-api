import { BaseEntity } from '@/shared/domain/entities/base-entity.entity';

type WalletProps = {
    name: string;
    balance: number;
};

export class Wallet extends BaseEntity<WalletProps> {
    constructor(
        id: string,
        props: WalletProps,
        createdAt: Date,
        updatedAt: Date,
    ) {
        super(id, props, createdAt, updatedAt);

        if (props.balance < 0) throw new Error('Invalid wallet amount');
        if (!props.name || props.name.trim() === '') {
            throw new Error('Wallet name cannot be empty');
        }
    }

    public get name(): string {
        return this.props.name;
    }

    public get balance(): number {
        return this.props.balance;
    }

    public rename(name: string): void {
        if (!name || name.trim() === '') {
            throw new Error('Wallet name cannot be empty');
        }

        this.props.name = name;
        this.touch();
    }

    public deposit(amount: number): void {
        if (amount <= 0) {
            throw new Error(
                'Cannot deposit an amount less than or equal to zero',
            );
        }

        this.props.balance += amount;
        this.touch();
    }

    public withdraw(amount: number) {
        if (amount <= 0) {
            throw new Error(
                'Cannot withdraw an amount less than or equal to zero',
            );
        }

        if (!this.canWithdraw(amount)) {
            throw new Error('Insufficient balance');
        }

        this.props.balance -= amount;
        this.touch();
    }

    public canWithdraw(amount: number): boolean {
        if (amount <= 0) {
            throw new Error('Invalid amount');
        }

        return this.props.balance >= amount;
    }
}
