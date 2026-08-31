import { Type } from 'class-transformer';
import { IsDate, IsEnum, IsNotEmpty, IsString, IsUUID } from 'class-validator';

import { ETransactionType } from '@/finance/domain/enums/transaction-type.enum';

export class CreateTransactionDto {
    @IsString()
    @IsNotEmpty()
    amount!: string;

    @IsString()
    @IsNotEmpty()
    description!: string;

    @Type(() => Date)
    @IsDate()
    date!: Date;

    @IsEnum(ETransactionType)
    type!: ETransactionType;

    @IsString()
    @IsNotEmpty()
    @IsUUID()
    categoryId!: string;

    @IsString()
    @IsNotEmpty()
    @IsUUID()
    walletId!: string;
}
