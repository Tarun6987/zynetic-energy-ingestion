-- CreateTable
CREATE TABLE "MeterTelemetryHistory" (
    "id" BIGSERIAL NOT NULL,
    "meterId" TEXT NOT NULL,
    "kwhConsumedAc" DECIMAL(18,6) NOT NULL,
    "voltage" DECIMAL(10,3) NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL,
    "ingestedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MeterTelemetryHistory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VehicleTelemetryHistory" (
    "id" BIGSERIAL NOT NULL,
    "vehicleId" TEXT NOT NULL,
    "soc" INTEGER NOT NULL,
    "kwhDeliveredDc" DECIMAL(18,6) NOT NULL,
    "batteryTemp" DECIMAL(10,3) NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL,
    "ingestedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "VehicleTelemetryHistory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LiveMeterStatus" (
    "meterId" TEXT NOT NULL,
    "kwhConsumedAc" DECIMAL(18,6) NOT NULL,
    "voltage" DECIMAL(10,3) NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LiveMeterStatus_pkey" PRIMARY KEY ("meterId")
);

-- CreateTable
CREATE TABLE "LiveVehicleStatus" (
    "vehicleId" TEXT NOT NULL,
    "soc" INTEGER NOT NULL,
    "kwhDeliveredDc" DECIMAL(18,6) NOT NULL,
    "batteryTemp" DECIMAL(10,3) NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LiveVehicleStatus_pkey" PRIMARY KEY ("vehicleId")
);

-- CreateIndex
CREATE INDEX "MeterTelemetryHistory_meterId_timestamp_idx" ON "MeterTelemetryHistory"("meterId", "timestamp");

-- CreateIndex
CREATE INDEX "MeterTelemetryHistory_timestamp_idx" ON "MeterTelemetryHistory"("timestamp");

-- CreateIndex
CREATE INDEX "VehicleTelemetryHistory_vehicleId_timestamp_idx" ON "VehicleTelemetryHistory"("vehicleId", "timestamp");

-- CreateIndex
CREATE INDEX "VehicleTelemetryHistory_timestamp_idx" ON "VehicleTelemetryHistory"("timestamp");
