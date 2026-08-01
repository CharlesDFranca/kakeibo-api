import { Wallet } from 'finance/domain/entities/wallet.entity';
import { IWalletRepository } from 'finance/domain/repositories/wallet-repository.interface';
import { IBaseUseCase } from 'shared/app/contracts/base-usecase.contract';
import { IIDGenerator } from 'shared/app/contracts/id-generator.contract';

type CreateWalletInput = {
    name: string;
};

type CreateWalletOutput = {
    id: string;
};

export class CreateWalletUseCase implements IBaseUseCase<
    CreateWalletInput,
    CreateWalletOutput
> {
    constructor(
        private readonly walletRepository: IWalletRepository,
        private readonly idGenerator: IIDGenerator,
    ) {}

    async execute(input: CreateWalletInput): Promise<CreateWalletOutput> {
        const existsByName = await this.walletRepository.findByName(input.name);

        if (existsByName) {
            throw new Error('Wallet already exists with this name');
        }

        const now = new Date();

        const wallet = new Wallet(
            this.idGenerator.generate(),
            {
                name: input.name,
                balance: 0,
            },
            now,
            now,
        );

        await this.walletRepository.create(wallet);

        return { id: wallet.id };
    }
}
