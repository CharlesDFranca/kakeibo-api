import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class RevertGoalDepositDto {
    @IsString()
    @IsNotEmpty()
    @IsUUID()
    categoryId!: string;
}
