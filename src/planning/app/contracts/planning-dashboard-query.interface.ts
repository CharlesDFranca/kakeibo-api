import { PlanningDashboardDetails } from './planning-dashboard-details.type';

export interface IPlanningDashboardQuery {
    findForDashboard(
        userId: string,
        limit: number,
    ): Promise<PlanningDashboardDetails[]>;
}
