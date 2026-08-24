import { IBaseUseCase } from '@/shared/app/contracts/base-usecase.contract';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import type { IUnitOfWork } from '@/shared/app/contracts/unit-of-work.contract';
import { Money } from '@/shared/domain/value-objects/Money';
import { Contribution } from '../../domain/entities/contribution.entity';
import type { IIDGenerator } from '@/shared/app/contracts/id-generator.contract';
import { Transaction } from '@/finance/transactions/domain/entities/transaction.entity';
import { TransactionType } from '@/finance/transactions/domain/value-objects/transaction-type.vo';
import { ETransactionType } from '@/finance/transactions/domain/enums/transaction-type.enum';
import { SHARED_TOKENS } from '@/shared/shared.token';

type RegisterContributionInput = {
    userId: string;
    walletId: string;
    goalId: string;
    categoryId: string;
    amount: string;
};

type RegisterContributionOutput = { id: string };

@Injectable()
export class RegisterContributionUseCase implements IBaseUseCase<
    RegisterContributionInput,
    RegisterContributionOutput
> {
    constructor(
        @Inject(SHARED_TOKENS.UNIT_OF_WORK)
        private readonly uow: IUnitOfWork,
        @Inject(SHARED_TOKENS.ID_GENERATOR)
        private readonly idGenerator: IIDGenerator,
    ) {}

    async execute(
        input: RegisterContributionInput,
    ): Promise<RegisterContributionOutput> {
        return this.uow.transaction(async () => {
            const goalRepository = this.uow.getGoalRepository();
            const walletRepository = this.uow.getWalletRepository();
            const contributionRepository = this.uow.getContributionRepository();
            const transactionRepository = this.uow.getTransactionRepository();

            const wallet = await walletRepository.findUserWalletById(
                input.userId,
                input.walletId,
            );

            if (!wallet) throw new NotFoundException('Wallet not found');

            const goal = await goalRepository.findUserGoalById(
                input.userId,
                input.goalId,
            );

            if (!goal) throw new NotFoundException('Goal not found');

            const amount = Money.fromAmount(input.amount);

            goal.contribute(amount);

            await goalRepository.update(goal);

            wallet.withdraw(amount);

            await walletRepository.update(wallet);

            const now = new Date();

            const contribution = new Contribution(
                this.idGenerator.generate(),
                {
                    amount: amount,
                    goalId: goal.id,
                    walletId: wallet.id,
                },
                now,
                now,
            );

            const transaction = new Transaction(
                this.idGenerator.generate(),
                {
                    amount: amount,
                    categoryId: input.categoryId,
                    walletId: wallet.id,
                    date: now,
                    description: 'Goal contribution',
                    type: new TransactionType(ETransactionType.EXPENSE),
                },
                now,
                now,
            );

            await transactionRepository.create(transaction);
            await contributionRepository.create(contribution);

            return { id: contribution.id };
        });
    }
}
