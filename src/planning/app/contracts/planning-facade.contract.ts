export interface HasWalletAllocatedToGoalsInput {
    userId: string;
    walletId: string;
}

export interface IPlanningFacade {
    hasWalletAllocatedToGoals(
        input: HasWalletAllocatedToGoalsInput,
    ): Promise<boolean>;
}
