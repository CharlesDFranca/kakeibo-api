import { IGoalMovementRepository } from '@/planning/domain/repositories/goal-movement-repository.interface';
import { IGoalRepository } from '@/planning/domain/repositories/goal-repository.interface';

export interface IPlanningUnitOfWork {
    transaction<T>(work: () => Promise<T>): Promise<T>;
    getGoalRepository(): IGoalRepository;
    getGoalMovementRepository(): IGoalMovementRepository;
}
