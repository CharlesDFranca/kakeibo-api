import { PlanningDashboardDetails } from '../types/planning-dashboard-details.type';

export interface IPlanningDashboardQuery {
    findForDashboard(
        userId: string,
        limit: number,
    ): Promise<PlanningDashboardDetails[]>;
}
