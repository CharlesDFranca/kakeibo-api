import { Inject, Injectable } from '@nestjs/common';

import { PLANNING_TOKENS } from '@/planning/planning.tokens';
import { PlanningDashboardDetails } from '../../contracts/planning-dashboard-details.type';
import type { IPlanningDashboardQuery } from '../../contracts/planning-dashboard-query.interface';

type GetPlanningDashboardInput = {
    userId: string;
};

type GetPlanningDashboardOutput = PlanningDashboardDetails[];

@Injectable()
export class GetPlanningDashboardUseCase {
    private readonly limit = 3;

    constructor(
        @Inject(PLANNING_TOKENS.PLANNING_DASHBOARD_QUERY)
        private readonly planningDashboardQuery: IPlanningDashboardQuery,
    ) {}

    async execute(
        input: GetPlanningDashboardInput,
    ): Promise<GetPlanningDashboardOutput> {
        return this.planningDashboardQuery.findForDashboard(
            input.userId,
            this.limit,
        );
    }
}
