import { Money } from '@/shared/domain/value-objects/money.vo';

export type WithdrawFromWalletInput = {
    userId: string;
    walletId: string;
    amount: Money;
    categoryId: string;
    description: string;
    date: Date;
};

// export type WithdrawFromWalletOutput = {
//     transactionId: string;
//     newBalance: Money;
// };

export type DepositToWalletInput = {
    userId: string;
    walletId: string;
    amount: Money;
    categoryId: string;
    description: string;
    date: Date;
};

// export type DepositToWalletOutput = {
//     transactionId: string;
//     newBalance: Money;
// };

export interface IFinanceFacade {
    withdrawFromWallet(
        input: WithdrawFromWalletInput,
    ): Promise<void>;
    depositToWallet(
        input: DepositToWalletInput,
    ): Promise<void>;
}
