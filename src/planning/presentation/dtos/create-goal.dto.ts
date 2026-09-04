import { Type } from 'class-transformer';
import {
    IsDate,
    IsNotEmpty,
    IsNumberString,
    IsOptional,
    IsString,
} from 'class-validator';

export class CreateGoalDto {
    @IsString()
    @IsNotEmpty()
    name!: string;

    @IsNumberString(
        { no_symbols: false },
        { message: 'targetAmount must be a valid monetary value' },
    )
    targetAmount!: string;

    @IsOptional()
    @Type(() => Date)
    @IsDate()
    deadline?: Date;
}
