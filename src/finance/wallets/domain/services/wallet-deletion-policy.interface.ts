export interface IWalletDeletionPolicy {
    ensureCanDelete(userId: string, walletId: string): Promise<void>;
}
