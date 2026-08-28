import { Goal } from '../entities/goal.entity';

export interface IGoalRepository {
    create(goal: Goal): Promise<void>;
    update(goal: Goal): Promise<void>;
    findAllForUser(userId: string): Promise<Goal[]>;
    findUserGoalByName(userId: string, name: string): Promise<Goal | null>;
    findUserGoalById(userId: string, goalId: string): Promise<Goal | null>;
    deleteUserGoal(userId: string, goalId: string): Promise<void>;
}
