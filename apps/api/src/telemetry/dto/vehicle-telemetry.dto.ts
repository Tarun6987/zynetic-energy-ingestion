import { Type } from 'class-transformer';
import { IsISO8601, IsInt, IsNotEmpty, IsNumber, IsString, Max, Min } from 'class-validator';

export class VehicleTelemetryDto {
  @IsString()
  @IsNotEmpty()
  vehicleId!: string;

  @IsInt()
  @Min(0)
  @Max(100)
  @Type(() => Number)
  soc!: number;

  @IsNumber()
  @Type(() => Number)
  kwhDeliveredDc!: number;

  @IsNumber()
  @Type(() => Number)
  batteryTemp!: number;

  @IsISO8601()
  timestamp!: string;
}
