import { Type } from 'class-transformer';
import { IsISO8601, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class MeterTelemetryDto {
  @IsString()
  @IsNotEmpty()
  meterId!: string;

  @IsNumber()
  @Type(() => Number)
  kwhConsumedAc!: number;

  @IsNumber()
  @Type(() => Number)
  voltage!: number;

  @IsISO8601()
  timestamp!: string;
}
