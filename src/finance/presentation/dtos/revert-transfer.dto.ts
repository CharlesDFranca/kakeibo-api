import { IsNotEmpty, IsUUID } from 'class-validator';

export class RevertTransferDto {
    @IsUUID()
    @IsNotEmpty()
    categoryId!: string;
}
