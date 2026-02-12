import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { MeterTelemetryDto } from './dto/meter-telemetry.dto';
import { VehicleTelemetryDto } from './dto/vehicle-telemetry.dto';
import { TelemetryService } from './telemetry.service';

@Controller('v1')
export class TelemetryController {
  constructor(private readonly telemetryService: TelemetryService) {}

  @Post('ingest/meter')
  ingestMeter(@Body() dto: MeterTelemetryDto) {
    return this.telemetryService.ingestMeter(dto);
  }

  @Post('ingest/vehicle')
  ingestVehicle(@Body() dto: VehicleTelemetryDto) {
    return this.telemetryService.ingestVehicle(dto);
  }

  @Get('analytics/performance/:vehicleId')
  getPerformance(@Param('vehicleId') vehicleId: string) {
    return this.telemetryService.getPerformanceSummary(vehicleId);
  }
}
