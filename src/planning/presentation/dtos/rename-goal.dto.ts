import { IsNotEmpty, IsString } from 'class-validator';

export class RenameGoalDto {
    @IsString()
    @IsNotEmpty()
    name!: string;
}
