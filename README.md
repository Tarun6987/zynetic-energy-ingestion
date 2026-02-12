# High-Scale Energy Ingestion Engine (Zynetic Assignment)

This repo contains a small fullstack implementation of the ingestion + analytics layer described in the assignment.

## Stack

- API: NestJS (TypeScript) + Prisma
- DB: PostgreSQL
- Web: Next.js (React) + Tailwind

## Monorepo layout

- `apps/api` NestJS API
- `apps/web` Next.js web UI

## Data model (Hot vs Cold)

This project separates telemetry into:

- Cold / Historical (append-only INSERT):
  - `MeterTelemetryHistory(meterId, kwhConsumedAc, voltage, timestamp, ingestedAt)`
  - `VehicleTelemetryHistory(vehicleId, soc, kwhDeliveredDc, batteryTemp, timestamp, ingestedAt)`

- Hot / Operational (UPSERT / current status):
  - `LiveMeterStatus(meterId, kwhConsumedAc, voltage, timestamp, updatedAt)`
  - `LiveVehicleStatus(vehicleId, soc, kwhDeliveredDc, batteryTemp, timestamp, updatedAt)`

Indexes exist on `(meterId, timestamp)` and `(vehicleId, timestamp)` to keep the 24h analytical query as an indexed range scan (avoid full table scans).

## Correlation assumption

The assignment describes two independent streams but the analytics endpoint is keyed by `vehicleId`. For this implementation we assume a 1:1 mapping:

- `meterId == vehicleId`

(If needed, this can be replaced by an explicit mapping table `vehicle_meter_map(vehicleId, meterId)`.)

## API

### Ingestion

- `POST /v1/ingest/meter`

```json
{ "meterId": "VEHICLE_001", "kwhConsumedAc": 10.5, "voltage": 230.1, "timestamp": "2026-02-12T05:53:17Z" }
```

- `POST /v1/ingest/vehicle`

```json
{ "vehicleId": "VEHICLE_001", "soc": 57, "kwhDeliveredDc": 8.9, "batteryTemp": 36.2, "timestamp": "2026-02-12T05:53:17Z" }
```

### Analytics

- `GET /v1/analytics/performance/:vehicleId`

Returns a rolling 24h summary:

- Total energy consumed (AC) vs delivered (DC)
- Efficiency ratio (`DC/AC`)
- Average battery temperature

## Local development

### 1) Run PostgreSQL locally

This repo includes `docker-compose.yml`, but you can also use Postgres.app.

If using Postgres.app:

- Ensure Postgres is running on `localhost:5432`
- Create a database named `zynetic`

### 2) Configure API env

`apps/api/.env`

- `DATABASE_URL=postgresql://<user>@localhost:5432/zynetic`
- `PORT=3001`

### 3) Run migrations

From `apps/api`:

```bash
npx prisma migrate dev
```

### 4) Start API

```bash
npm run start:dev
```

API runs on `http://localhost:3001`.

### 5) Configure Web env

`apps/web/.env.local`

```bash
NEXT_PUBLIC_API_BASE_URL=http://localhost:3001
```

### 6) Start Web

```bash
npm run dev
```

Web runs on `http://localhost:3000`.

## Deployment (free tiers)

Recommended:

- Web: Vercel
- API: Render
- DB: Neon

You will need to create free accounts on these services to deploy.
