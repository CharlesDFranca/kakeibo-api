export { Goal } from './entities/goal.entity';
export { GoalMovement } from './entities/goal-movement.entity';

export type { IGoalRepository } from './repositories/goal-repository.interface';
export type { IGoalMovementRepository } from './repositories/goal-movement-repository.interface';

export { GoalDeadline } from './value-objects/goal-deadline';
export { GoalStatus } from './value-objects/goal-status.vo';
export { GoalMovementType } from './value-objects/goal-movement-type.vo';

export { EGoalStatus } from './enums/goal-status.enum';
export { EGoalMovementType } from './enums/goal-movement-type.enum';
