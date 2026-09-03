import { Inject, Injectable } from '@nestjs/common';
import { CORE_TOKENS } from '@/core/core.tokens';
import { FINANCE_TOKENS } from '@/finance/finance.tokens';
import type { IFinanceUnitOfWork } from '@/finance/app/contracts/finance-unit-of-work.contract';
import {
    IFinanceFacade,
    WithdrawFromWalletInput,
    DepositToWalletInput,
} from '../../api/fincance-facade.contract';
import { WalletNotFoundError } from '../errors/wallet-not-found.error';
import { Transaction } from '@/finance/domain/entities/transaction.entity';
import { TransactionType } from '@/finance/domain/value-objects/transaction-type.vo';
import { ETransactionType } from '@/finance/domain/enums/transaction-type.enum';
import type { IIDGenerator } from '@/core/app/contracts/id-generator.contract';
import { BasicCategories } from '@/finance/domain/enums/basic-categories.enum';
import { Category } from '@/finance/domain/entities/category.entity';
import { Name } from '@/shared/domain/value-objects/name.vo';
import { SystemCategory } from '@/finance/domain/enums/system-cateogories.enum';

@Injectable()
export class FinanceFacade implements IFinanceFacade {
    constructor(
        @Inject(FINANCE_TOKENS.UNIT_OF_WORK)
        private readonly financeUow: IFinanceUnitOfWork,
        @Inject(CORE_TOKENS.ID_GENERATOR)
        private readonly idGenerator: IIDGenerator,
    ) {}

    async withdrawFromWallet(input: WithdrawFromWalletInput): Promise<void> {
        const walletRepo = this.financeUow.getWalletRepository();
        const txRepo = this.financeUow.getTransactionRepository();

        const wallet = await walletRepo.findUserWalletById(
            input.userId,
            input.walletId,
        );
        if (!wallet) throw new WalletNotFoundError();

        wallet.withdraw(input.amount);

        const transaction = new Transaction(
            this.idGenerator.generate(),
            {
                amount: input.amount,
                categoryId: input.categoryId,
                walletId: wallet.id,
                date: input.date,
                description: input.description,
                type: new TransactionType(ETransactionType.TRANSFER),
            },
            input.date,
            input.date,
        );

        await walletRepo.update(wallet);
        await txRepo.create(transaction);
    }

    async depositToWallet(input: DepositToWalletInput): Promise<void> {
        const walletRepo = this.financeUow.getWalletRepository();
        const txRepo = this.financeUow.getTransactionRepository();

        const wallet = await walletRepo.findUserWalletById(
            input.userId,
            input.walletId,
        );
        if (!wallet) throw new WalletNotFoundError();

        wallet.deposit(input.amount);

        const transaction = new Transaction(
            this.idGenerator.generate(),
            {
                amount: input.amount,
                categoryId: input.categoryId,
                walletId: wallet.id,
                date: input.date,
                description: input.description,
                type: new TransactionType(ETransactionType.TRANSFER),
            },
            input.date,
            input.date,
        );

        await walletRepo.update(wallet);
        await txRepo.create(transaction);
    }

    async createBasicCategories(userId: string): Promise<void> {
        const categoryRepo = this.financeUow.getCategoryRepository();
        const now = new Date();

        const categories = Object.values(BasicCategories).map(
            (name) =>
                new Category(
                    this.idGenerator.generate(),
                    {
                        userId,
                        name: new Name(name),
                        isSystem: false,
                        isActive: true,
                    },
                    now,
                    now,
                ),
        );

        await categoryRepo.createMany(categories);
    }

    async createSystemCategories(userId: string): Promise<void> {
        const categoryRepo = this.financeUow.getCategoryRepository();
        const now = new Date();

        const categories = Object.values(SystemCategory).map(
            (name) =>
                new Category(
                    this.idGenerator.generate(),
                    {
                        userId,
                        name: new Name(name),
                        isSystem: true,
                        isActive: true,
                    },
                    now,
                    now,
                ),
        );

        await categoryRepo.createMany(categories);
    }
}
