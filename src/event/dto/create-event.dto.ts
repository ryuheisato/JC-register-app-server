import { IsString, IsDateString, IsNumber } from 'class-validator';

export class CreateEventDto {
  @IsString()
  name: string;

  @IsDateString()
  date: string;

  @IsString()
  description?: string;

  @IsNumber()
  semesterId: number;
}
