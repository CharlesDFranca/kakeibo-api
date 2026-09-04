import { ETransactionType } from '@/finance/domain/enums/transaction-type.enum';
import {
    IsArray,
    IsDateString,
    IsEnum,
    IsOptional,
    IsUUID,
} from 'class-validator';

export class ListTransactionsDto {
    @IsOptional()
    @IsArray()
    @IsUUID('4', { each: true })
    categoryIds?: string[];

    @IsOptional()
    @IsArray()
    @IsUUID('4', { each: true })
    walletIds?: string[];

    @IsOptional()
    @IsDateString()
    startDate?: string;

    @IsOptional()
    @IsDateString()
    endDate?: string;

    @IsOptional()
    @IsEnum(ETransactionType)
    type?: ETransactionType;
}
