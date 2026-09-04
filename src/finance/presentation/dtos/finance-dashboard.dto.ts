import { IsDateString, IsNotEmpty } from 'class-validator';

export class GetFinanceDashboardDto {
    @IsNotEmpty()
    @IsDateString()
    startDate?: string;

    @IsNotEmpty()
    @IsDateString()
    endDate?: string;
}
