import { IsNotEmpty, IsString } from 'class-validator';

export class RenameWalletDto {
    @IsString()
    @IsNotEmpty()
    name!: string;
}
