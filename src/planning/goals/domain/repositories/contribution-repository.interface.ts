import { Contribution } from '../entities/contribution.entity';

export interface IContributionRepository {
    create(contribution: Contribution): Promise<void>;
    findById(id: string): Promise<Contribution | null>;
    findByGoalId(goalId: string): Promise<Contribution[]>;
    deleteByGoalId(goalId: string): Promise<void>;
}
