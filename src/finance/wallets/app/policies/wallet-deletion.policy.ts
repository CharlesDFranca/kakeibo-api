import type { IGoalMovementRepository } from '@/planning/goals/domain/repositories/goal-movement-repository.interface';
import { Injectable } from '@nestjs/common';
import { IWalletDeletionPolicy } from '../../domain/services/wallet-deletion-policy.interface';

@Injectable()
export class WalletDeletionPolicy implements IWalletDeletionPolicy {
    constructor(
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
