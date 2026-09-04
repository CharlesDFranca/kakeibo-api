import { Wallet } from '@/finance/domain/entities/wallet.entity';
import { FINANCE_TOKENS } from '@/finance/finance.tokens';
import { IBaseUseCase } from '@/shared/app/contracts/base-usecase.contract';
import type { IIDGenerator } from '@/core/app/contracts/id-generator.contract';
import { Inject, Injectable } from '@nestjs/common';
import { Money } from '@/shared/domain/value-objects/money.vo';
import { Name } from '@/shared/domain/value-objects/name.vo';
import { WalletAlreadyExistsError } from '../../errors/wallet-already-exists.error';
import { CORE_TOKENS } from '@/core/core.tokens';
import { Transaction } from '@/finance/domain/entities/transaction.entity';
import { SystemCategory } from '@/finance/domain/enums/system-cateogories.enum';
import { CategoryNotFoundError } from '../../errors/category-not-found.error';
import { TransactionType } from '@/finance/domain/value-objects/transaction-type.vo';
import { ETransactionType } from '@/finance/domain/enums/transaction-type.enum';
import type { IFinanceUnitOfWork } from '../../contracts/finance-unit-of-work.contract';

type CreateWalletInput = {
    name: string;
    balance: string;
    userId: string;
};

type CreateWalletOutput = {
    id: string;
};

@Injectable()
export class CreateWalletUseCase implements IBaseUseCase<
    CreateWalletInput,
    CreateWalletOutput
> {
    constructor(
        @Inject(CORE_TOKENS.ID_GENERATOR)
        private readonly idGenerator: IIDGenerator,
        @Inject(FINANCE_TOKENS.UNIT_OF_WORK)
        private readonly financeUow: IFinanceUnitOfWork,
    ) {}

    async execute(input: CreateWalletInput): Promise<CreateWalletOutput> {
        const wallet = await this.financeUow.transaction(async () => {
            const walletRepository = this.financeUow.getWalletRepository();
            const transactionRepository =
                this.financeUow.getTransactionRepository();
            const categoryRepository = this.financeUow.getCategoryRepository();

            const existsByName = await walletRepository.findUserWalletByName(
                input.userId,
                input.name,
            );

            if (existsByName) throw new WalletAlreadyExistsError();

            const category = await categoryRepository.findSystemCategory(
                input.userId,
                SystemCategory.OPENING_BALANCE,
            );

            if (!category) throw new CategoryNotFoundError();

            const now = new Date();
            const walletId = this.idGenerator.generate();

            const transaction = new Transaction(
                this.idGenerator.generate(),
                {
                    amount: Money.fromAmount(input.balance),
                    categoryId: category.id,
                    walletId,
                    date: now,
                    description: 'Opening balance',
                    type: new TransactionType(ETransactionType.OPENING_BALANCE),
                },
                now,
                now,
            );

            const wallet = new Wallet(
                walletId,
                {
                    name: new Name(input.name),
                    balance: transaction.amount,
                    userId: input.userId,
                },
                now,
                now,
            );

            await walletRepository.create(wallet);
            await transactionRepository.create(transaction);

            return wallet;
        });

        return { id: wallet.id };
    }
}
