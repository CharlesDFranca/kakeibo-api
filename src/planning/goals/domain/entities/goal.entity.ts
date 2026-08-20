import { BaseEntity } from '@/shared/domain/entities/base-entity.entity';
import { GoalStatus } from '../value-objects/goal-status.vo';

type GoalProps = {
    userId: string;
    name: string;
    targetAmount: number;
    currentAmount: number;
    deadline?: Date | undefined;
    status: GoalStatus;
};

export class Goal extends BaseEntity<GoalProps> {
    constructor(
        id: string,
        props: GoalProps,
        createdAt: Date,
        updatedAt: Date,
    ) {
        if (props.targetAmount < 0) {
            throw new Error(
                'Cannot create a goal with a negative target amount',
            );
        }

        if (props.currentAmount < 0) {
            throw new Error(
                'Cannot create a goal with a negative current amount',
            );
        }

        const minimumDeadline = new Date(Date.now() + 24 * 60 * 60 * 1000);

        if (
            props.deadline &&
            props.deadline.getTime() <= minimumDeadline.getTime()
        ) {
            throw new Error(
                'A deadline must be at least 24 hours after goal creation',
            );
        }

        super(id, props, createdAt, updatedAt);
    }

    public get name(): string {
        return this.props.name;
    }

    public get userId(): string {
        return this.props.userId;
    }

    public get targetAmount(): number {
        return this.props.targetAmount;
    }

    public get currentAmount(): number {
        return this.props.currentAmount;
    }

    public get deadline(): Date | undefined {
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

    public necessaryToComplet(): number {
        return Math.max(0, this.targetAmount - this.currentAmount);
    }

    public deposit(amount: number): void {
        this.ensureInProgress();
        this.ensurePositiveAmount(amount);

        this.props.currentAmount += amount;
        this.touch();

        if (this.currentAmount >= this.targetAmount) {
            this.complete();
        }
    }

    public withdraw(amount: number): void {
        this.ensureInProgress();
        this.ensurePositiveAmount(amount);

        if (this.currentAmount - amount < 0) {
            throw new Error(
                'Cannot withdraw an amount greather than the current amount',
            );
        }

        this.props.currentAmount -= amount;
        this.touch();
    }

    public complete(): void {
        if (this.isExpired()) {
            throw new Error('Cannot complete an expired goal');
        }

        if (this.isCancelled()) {
            throw new Error('Cannot complete a cancelled goal');
        }

        if (this.isPaused()) {
            throw new Error('Cannot complete a paused goal');
        }

        if (this.currentAmount < this.targetAmount) {
            throw new Error('Target amount not reached');
        }

        if (this.isCompleted()) return;

        this.props.status = new GoalStatus('COMPLETED');
        this.touch();
    }

    public cancel(): void {
        if (this.isExpired()) {
            throw new Error('Cannot cancel an expired goal');
        }

        if (this.isCompleted()) {
            throw new Error('Cannot cancel a completed goal');
        }

        if (this.isCancelled()) return;

        this.props.status = new GoalStatus('CANCELLED');
        this.touch();
    }

    public pause(): void {
        if (this.isExpired()) {
            throw new Error('Cannot pause an expired goal');
        }

        if (this.isCompleted()) {
            throw new Error('Cannot pause a completed goal');
        }

        if (this.isCancelled()) {
            throw new Error('Cannot pause a cancelled goal');
        }

        if (this.status.isPaused()) return;

        this.props.status = new GoalStatus('PAUSED');
        this.touch();
    }

    public active(): void {
        if (this.isExpired()) {
            throw new Error('Cannot active an expired goal');
        }

        if (!this.isPaused()) return;

        this.props.status = new GoalStatus('IN PROGRESS');
        this.touch();
    }

    public expire(): void {
        if (this.isCompleted()) {
            throw new Error('Cannot expire a completed goal');
        }

        if (this.isCancelled()) {
            throw new Error('Cannot expire a cancelled goal');
        }

        if (!this.deadline) {
            throw new Error('A goal without a deadline cannot expire');
        }

        if (this.deadline.getTime() > Date.now()) {
            throw new Error('Expiration date not reached');
        }

        if (!this.isExpired()) return;

        this.props.status = new GoalStatus('EXPIRED');
        this.touch();
    }

    public updateTarget(amount: number): void {
        if (this.isExpired()) {
            throw new Error(
                'Cannot uptade the target amount into a goal that is expired',
            );
        }

        if (this.isPaused()) {
            throw new Error(
                'Cannot update the target amount into a paused goal',
            );
        }

        if (amount < 0) {
            throw new Error('Cannot set a negative target amount');
        }

        this.props.targetAmount = amount;
        this.touch();

        if (this.targetAmount <= this.currentAmount) {
            this.complete();
        }
    }

    public updateDeadline(deadline: Date | undefined): void {
        if (deadline === undefined) {
            if (this.deadline === undefined && !this.isExpired()) {
                return;
            }

            this.props.deadline = undefined;

            if (this.isExpired()) {
                this.props.status = new GoalStatus('IN PROGRESS');
            }

            this.touch();
            return;
        }

        const minimumDeadline = new Date(
            this.createdAt.getTime() + 24 * 60 * 60 * 1000,
        );

        if (deadline.getTime() < minimumDeadline.getTime()) {
            throw new Error(
                'A deadline must have at least one day ultil it is due',
            );
        }

        this.props.deadline = deadline;
        this.touch();

        if (this.deadline && this.deadline.getTime() <= Date.now()) {
            this.expire();
        }
    }

    private ensureInProgress(): void {
        if (this.isExpired()) {
            throw new Error('Cannot modify an expired goal');
        }

        if (!this.isInProgress()) {
            throw new Error('Goal must be in progress');
        }
    }

    private ensurePositiveAmount(amount: number): void {
        if (amount < 0) {
            throw new Error('Amount cannot be negative');
        }
    }
}
