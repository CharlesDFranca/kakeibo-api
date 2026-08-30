import { BaseEntity } from '@/shared/domain/entities/base-entity.entity';
import { Money } from '@/shared/domain/value-objects/money.vo';

import { GoalDeadline } from '../value-objects/goal-deadline.vo';
import { GoalStatus } from '../value-objects/goal-status.vo';
import { EGoalStatus } from '../enums/goal-status.enum';
import { Name } from '@/shared/domain/value-objects/name.vo';
import { CompletedGoalCannotBeExpiredError } from '../errors/completed-goal-cannot-be-expired.error';
import { GoalWithoutDeadlineCannotExpireError } from '../errors/goal-without-deadline-cannot-expire.error';
import { GoalDeadlineMustBeReachedBeforeExpirationError } from '../errors/goal-deadline-must-be-reached-before-expiration.error';
import { OnlyExpiredGoalsCanBeReactivatedError } from '../errors/only-expired-goals-can-be-reactivated.error';
import { GoalTargetAmountMustBeReachedError } from '../errors/goal-target-amount-must-be-reached.error';
import { InsufficientGoalBalanceError } from '../errors/insufficient-goal-balance.error';
import { GoalCurrentAmountCannotExceedTargetError } from '../errors/goal-current-amount-cannot-exceed-target-error';
import { GoalMustBeInProgressError } from '../errors/goal-must-be-in-progress.error';
import { ExpiredGoalCannotBeCompletedError } from '../errors/expired-goal-cannot-be-completed.error';
import { GoalDeadlineCannotAlreadyBeExpiredError } from '../errors/goal-deadline-cannot-already-be-expired.error';

type GoalProps = {
    userId: string;
    name: Name;
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

    public get name(): Name {
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

    public isInProgress(): boolean {
        return this.status.isInProgress();
    }

    public isExpired(): boolean {
        return this.status.isExpired();
    }

    public necessaryToComplete(): Money {
        return this.currentAmount.isGreaterThanOrEqual(this.targetAmount)
            ? Money.zero()
            : this.targetAmount.subtract(this.currentAmount);
    }

    public rename(name: Name): void {
        if (this.name.equals(name)) return;

        this.props.name = name;
        this.touch();
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

        if (amount.isGreaterThan(this.currentAmount)) {
            throw new InsufficientGoalBalanceError();
        }

        this.props.currentAmount = this.currentAmount.subtract(amount);

        this.touch();
    }

    public complete(): void {
        if (this.isCompleted()) {
            return;
        }

        this.ensureCanComplete();

        if (this.currentAmount.isLessThan(this.targetAmount)) {
            throw new GoalTargetAmountMustBeReachedError();
        }

        this.props.status = new GoalStatus(EGoalStatus.COMPLETED);
        this.removeDeadline();
        this.touch();
    }

    public activate(): void {
        this.props.status = new GoalStatus(EGoalStatus.IN_PROGRESS);
        this.touch();
    }

    public reactivate(deadline?: GoalDeadline): void {
        if (!this.isExpired()) {
            throw new OnlyExpiredGoalsCanBeReactivatedError();
        }

        this.props.deadline = deadline;
        this.props.status = new GoalStatus(EGoalStatus.IN_PROGRESS);

        this.touch();
    }

    public expire(): void {
        if (this.isExpired()) {
            return;
        }

        if (this.isCompleted()) throw new CompletedGoalCannotBeExpiredError();

        if (!this.deadline) throw new GoalWithoutDeadlineCannotExpireError();

        if (!this.deadline.isExpired()) {
            throw new GoalDeadlineMustBeReachedBeforeExpirationError();
        }

        this.props.status = new GoalStatus(EGoalStatus.EXPIRED);
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
            throw new GoalDeadlineCannotAlreadyBeExpiredError();
        }

        this.props.deadline = deadline;
        this.touch();
    }

    private ensureValidAmounts(): void {
        if (this.currentAmount.isGreaterThan(this.targetAmount)) {
            throw new GoalCurrentAmountCannotExceedTargetError();
        }
    }

    private ensureInProgress(): void {
        if (!this.isInProgress()) throw new GoalMustBeInProgressError();
    }

    private ensureCanComplete(): void {
        if (this.isExpired()) throw new ExpiredGoalCannotBeCompletedError();
    }

    private removeDeadline(): void {
        this.props.deadline = undefined;
    }
}
