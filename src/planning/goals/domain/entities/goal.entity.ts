import { BaseEntity } from '@/shared/domain/entities/base-entity.entity';
import { Money } from '@/shared/domain/value-objects/Money';

import { GoalDeadline } from '../value-objects/goal-deadline';
import { GoalStatus } from '../value-objects/goal-status.vo';

type GoalProps = {
    userId: string;
    name: string;
    targetAmount: Money;
    currentAmount: Money;
    deadline?: GoalDeadline | undefined;
    status: GoalStatus;
};

export class Goal extends BaseEntity<GoalProps> {
    constructor(
        id: string,
        props: GoalProps,
        createdAt: Date,
        updatedAt: Date,
    ) {
        super(id, props, createdAt, updatedAt);

        this.ensureValidAmounts();
    }

    public get name(): string {
        return this.props.name;
    }

    public get userId(): string {
        return this.props.userId;
    }

    public get targetAmount(): Money {
        return this.props.targetAmount;
    }

    public get currentAmount(): Money {
        return this.props.currentAmount;
    }

    public get deadline(): GoalDeadline | undefined {
        return this.props.deadline;
    }

    public get status(): GoalStatus {
        return this.props.status;
    }

    public isCompleted(): boolean {
        return this.status.isCompleted();
    }

    public isCancelled(): boolean {
        return this.status.isCancelled();
    }

    public isInProgress(): boolean {
        return this.status.isInProgress();
    }

    public isPaused(): boolean {
        return this.status.isPaused();
    }

    public isExpired(): boolean {
        return this.status.isExpired();
    }

    public necessaryToComplete(): Money {
        return this.currentAmount.isGreaterThanOrEqual(this.targetAmount)
            ? Money.zero()
            : this.targetAmount.subtract(this.currentAmount);
    }

    public contribute(amount: Money): void {
        this.ensureInProgress();

        this.props.currentAmount = this.currentAmount.add(amount);

        if (this.currentAmount.isGreaterThanOrEqual(this.targetAmount)) {
            this.complete();
            return;
        }

        this.touch();
    }

    public withdraw(amount: Money): void {
        this.ensureInProgress();

        this.props.currentAmount = this.currentAmount.subtract(amount);

        this.touch();
    }

    public complete(): void {
        if (this.isCompleted()) {
            return;
        }

        this.ensureCanComplete();

        if (this.currentAmount.isLessThan(this.targetAmount)) {
            throw new Error('Target amount not reached');
        }

        this.props.status = new GoalStatus('COMPLETED');
        this.removeDeadline();
        this.touch();
    }

    public cancel(): void {
        if (this.isCancelled()) {
            return;
        }

        if (this.isCompleted()) {
            throw new Error('Cannot cancel a completed goal');
        }

        this.props.status = new GoalStatus('CANCELLED');
        this.removeDeadline();
        this.touch();
    }

    public pause(): void {
        if (this.isPaused()) {
            return;
        }

        this.ensureInProgress();

        this.props.status = new GoalStatus('PAUSED');
        this.touch();
    }

    public activate(): void {
        if (!this.isPaused()) {
            return;
        }

        this.props.status = new GoalStatus('IN PROGRESS');
        this.touch();
    }

    public reactivate(deadline?: GoalDeadline): void {
        if (!this.isExpired()) {
            throw new Error('Only expired goals can be reactivated');
        }

        this.props.deadline = deadline;
        this.props.status = new GoalStatus('IN PROGRESS');

        this.touch();
    }

    public expire(): void {
        if (this.isExpired()) {
            return;
        }

        if (this.isCompleted()) {
            throw new Error('Cannot expire a completed goal');
        }

        if (this.isCancelled()) {
            throw new Error('Cannot expire a cancelled goal');
        }

        if (!this.deadline) {
            throw new Error('A goal without a deadline cannot expire');
        }

        if (!this.deadline.isExpired()) {
            throw new Error('Expiration date not reached');
        }

        this.props.status = new GoalStatus('EXPIRED');
        this.touch();
    }

    public updateTarget(amount: Money): void {
        this.ensureInProgress();

        this.props.targetAmount = amount;

        if (this.currentAmount.isGreaterThanOrEqual(this.targetAmount)) {
            this.complete();
            return;
        }

        this.touch();
    }

    public updateDeadline(deadline?: GoalDeadline): void {
        this.ensureInProgress();

        if (deadline?.isExpired()) {
            throw new Error('A deadline cannot already be expired');
        }

        this.props.deadline = deadline;
        this.touch();
    }

    private ensureValidAmounts(): void {
        if (this.currentAmount.isGreaterThan(this.targetAmount)) {
            throw new Error(
                'Current amount cannot be greater than target amount',
            );
        }
    }

    private ensureInProgress(): void {
        if (!this.isInProgress()) {
            throw new Error('Goal must be in progress');
        }
    }

    private ensureCanComplete(): void {
        if (this.isExpired()) {
            throw new Error('Cannot complete an expired goal');
        }

        if (this.isCancelled()) {
            throw new Error('Cannot complete a cancelled goal');
        }

        if (this.isPaused()) {
            throw new Error('Cannot complete a paused goal');
        }
    }

    private removeDeadline(): void {
        this.props.deadline = undefined;
    }
}
