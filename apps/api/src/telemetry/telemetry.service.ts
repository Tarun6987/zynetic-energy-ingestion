import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { MeterTelemetryDto } from './dto/meter-telemetry.dto';
import { VehicleTelemetryDto } from './dto/vehicle-telemetry.dto';

@Injectable()
export class TelemetryService {
  constructor(private readonly prisma: PrismaService) {}

  async ingestMeter(dto: MeterTelemetryDto) {
    const timestamp = new Date(dto.timestamp);

    await this.prisma.meterTelemetryHistory.create({
      data: {
        meterId: dto.meterId,
        kwhConsumedAc: dto.kwhConsumedAc,
        voltage: dto.voltage,
        timestamp,
      },
    });

    await this.prisma.liveMeterStatus.upsert({
      where: { meterId: dto.meterId },
      create: {
        meterId: dto.meterId,
        kwhConsumedAc: dto.kwhConsumedAc,
        voltage: dto.voltage,
        timestamp,
      },
      update: {
        kwhConsumedAc: dto.kwhConsumedAc,
        voltage: dto.voltage,
        timestamp,
      },
    });

    return { ok: true };
  }

  async ingestVehicle(dto: VehicleTelemetryDto) {
    const timestamp = new Date(dto.timestamp);

    await this.prisma.vehicleTelemetryHistory.create({
      data: {
        vehicleId: dto.vehicleId,
        soc: dto.soc,
        kwhDeliveredDc: dto.kwhDeliveredDc,
        batteryTemp: dto.batteryTemp,
        timestamp,
      },
    });

    await this.prisma.liveVehicleStatus.upsert({
      where: { vehicleId: dto.vehicleId },
      create: {
        vehicleId: dto.vehicleId,
        soc: dto.soc,
        kwhDeliveredDc: dto.kwhDeliveredDc,
        batteryTemp: dto.batteryTemp,
        timestamp,
      },
      update: {
        soc: dto.soc,
        kwhDeliveredDc: dto.kwhDeliveredDc,
        batteryTemp: dto.batteryTemp,
        timestamp,
      },
    });

    return { ok: true };
  }

  async getPerformanceSummary(vehicleId: string) {
    const now = new Date();
    const from = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    const [meterAgg, vehicleAgg] = await Promise.all([
      this.prisma.meterTelemetryHistory.aggregate({
        where: {
          meterId: vehicleId,
          timestamp: { gte: from, lte: now },
        },
        _sum: { kwhConsumedAc: true },
      }),
      this.prisma.vehicleTelemetryHistory.aggregate({
        where: {
          vehicleId,
          timestamp: { gte: from, lte: now },
        },
        _sum: { kwhDeliveredDc: true },
        _avg: { batteryTemp: true },
      }),
    ]);

    const acStr = meterAgg._sum.kwhConsumedAc?.toString() ?? '0';
    const dcStr = vehicleAgg._sum.kwhDeliveredDc?.toString() ?? '0';

    const ac = Number.parseFloat(acStr);
    const dc = Number.parseFloat(dcStr);

    const efficiencyRatio = ac > 0 ? dc / ac : null;

    return {
      vehicleId,
      windowHours: 24,
      from: from.toISOString(),
      to: now.toISOString(),
      totalEnergyConsumedAcKwh: ac,
      totalEnergyDeliveredDcKwh: dc,
      efficiencyRatio,
      averageBatteryTempC: vehicleAgg._avg.batteryTemp
        ? Number.parseFloat(vehicleAgg._avg.batteryTemp.toString())
        : null,
    };
  }
}
