import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateTransferDto {
    @IsString()
    @IsNotEmpty()
    amount!: string;

    @IsUUID()
    sourceWalletId!: string;

    @IsUUID()
    destinationWalletId!: string;
}
