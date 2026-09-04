import { IsNotEmpty, IsNumberString, IsString, IsUUID } from 'class-validator';

export class RegisterGoalDepositDto {
    @IsString()
    @IsNotEmpty()
    @IsUUID()
    walletId!: string;

    @IsString()
    @IsNotEmpty()
    @IsUUID()
    categoryId!: string;

    @IsNumberString(
        { no_symbols: false },
        { message: 'amount must be a valid monetary value' },
    )
    amount!: string;
}
