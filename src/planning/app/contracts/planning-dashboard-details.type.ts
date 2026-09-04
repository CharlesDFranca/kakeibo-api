import { Money } from '@/shared/domain/value-objects/money.vo';

export type PlanningDashboardDetails = {
    id: string;
    name: string;
    currentAmount: Money;
    targetAmount: Money;
    percentage: number;
    deadline: Date | null;
};
