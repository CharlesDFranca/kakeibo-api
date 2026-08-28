import type { IGoalMovementRepository } from '@/planning/goals/domain/repositories/goal-movement-repository.interface';
import { Inject, Injectable } from '@nestjs/common';
import { IWalletDeletionPolicy } from '../../domain/services/wallet-deletion-policy.interface';
import { PLANNING_TOKENS } from '@/planning/planning.tokens';

@Injectable()
export class WalletDeletionPolicy implements IWalletDeletionPolicy {
    constructor(
        @Inject(PLANNING_TOKENS.GOAL_MOVEMENT_REPOSITORY)
        private readonly goalMovementRepository: IGoalMovementRepository,
    ) {}

    async ensureCanDelete(userId: string, walletId: string): Promise<void> {
        const hasAllocatedMoney =
            await this.goalMovementRepository.hasAllocatedAmountFromWallet(
                userId,
                walletId,
            );

        if (hasAllocatedMoney) {
            throw new Error('Cannot delete wallet with allocated money');
        }
    }
}
