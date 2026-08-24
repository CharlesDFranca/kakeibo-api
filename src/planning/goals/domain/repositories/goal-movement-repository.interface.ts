import { GoalMovement } from '../entities/goal-movement.entity';

export interface IGoalMovementRepository {
    create(goalMovement: GoalMovement): Promise<void>;
    findById(id: string): Promise<GoalMovement | null>;
    findByGoalId(goalId: string): Promise<GoalMovement[]>;
    deleteByGoalId(goalId: string): Promise<void>;
}
