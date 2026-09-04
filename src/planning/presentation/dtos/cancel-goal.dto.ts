import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CancelGoalDto {
    @IsString()
    @IsNotEmpty()
    @IsUUID()
    categoryId!: string;
}
