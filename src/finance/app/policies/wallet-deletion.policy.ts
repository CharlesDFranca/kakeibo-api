import { Inject, Injectable } from '@nestjs/common';
import { IWalletDeletionPolicy } from '../../domain/services/wallet-deletion-policy.interface';
import { PLANNING_TOKENS } from '@/planning/planning.tokens';
import { WalletHasAllocatedMoneyError } from '@/finance/domain/errors/wallet-has-allocated-money.error';
import type { IPlanningFacade } from '@/planning/app/api/planning-facade.contract';

@Injectable()
export class WalletDeletionPolicy implements IWalletDeletionPolicy {
    constructor(
        @Inject(PLANNING_TOKENS.FACADE)
        private readonly planningFacade: IPlanningFacade,
    ) {}

    async ensureCanDelete(userId: string, walletId: string): Promise<void> {
        const hasAllocatedMoney =
            await this.planningFacade.hasWalletAllocatedToGoals({
                userId,
                walletId,
            });

        if (hasAllocatedMoney) throw new WalletHasAllocatedMoneyError();
    }
}
