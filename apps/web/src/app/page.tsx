export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900">
      <main className="mx-auto flex w-full max-w-4xl flex-col gap-6 px-6 py-12">
        <header className="flex flex-col gap-2">
          <h1 className="text-2xl font-semibold tracking-tight">
            Energy Ingestion Analytics
          </h1>
          <p className="text-sm text-zinc-600">
            Query 24-hour performance summary for a vehicle.
          </p>
        </header>

        <section className="rounded-xl border border-zinc-200 bg-white p-5">
          <div className="flex items-center justify-between gap-4">
            <div className="flex flex-col">
              <span className="text-sm font-medium">API Base URL</span>
              <span className="text-sm text-zinc-600">
                {process.env.NEXT_PUBLIC_API_BASE_URL ?? "(not set)"}
              </span>
            </div>
            <a
              className="text-sm font-medium text-zinc-900 underline"
              href="/"
            >
              Refresh
            </a>
          </div>
        </section>

        <section className="rounded-xl border border-zinc-200 bg-white p-5">
          <h2 className="text-base font-semibold">How to use (Production)</h2>
          <div className="mt-2 grid gap-2 text-sm text-zinc-700">
            <p>
              1. Ingest telemetry using the API endpoints.
            </p>
            <p>
              2. Fetch the 24-hour performance summary by vehicleId.
            </p>
            <p>
              Analytics endpoint:
              {" "}
              <code className="rounded bg-zinc-100 px-1">
                /v1/analytics/performance/&lt;vehicleId&gt;
              </code>
            </p>
          </div>
        </section>

        <section className="rounded-xl border border-zinc-200 bg-white p-5">
          <h2 className="text-base font-semibold">Sample requests</h2>
          <pre className="mt-2 overflow-x-auto rounded-lg bg-zinc-950 p-4 text-xs text-zinc-50">
{`# 1) Ingest Meter (AC)
curl -s -X POST "${process.env.NEXT_PUBLIC_API_BASE_URL ?? ""}/v1/ingest/meter" \
  -H "content-type: application/json" \
  -d '{"meterId":"VEHICLE_001","kwhConsumedAc":10.5,"voltage":230.1,"timestamp":"2026-02-12T05:53:17Z"}'

# 2) Ingest Vehicle (DC)
curl -s -X POST "${process.env.NEXT_PUBLIC_API_BASE_URL ?? ""}/v1/ingest/vehicle" \
  -H "content-type: application/json" \
  -d '{"vehicleId":"VEHICLE_001","soc":57,"kwhDeliveredDc":8.9,"batteryTemp":36.2,"timestamp":"2026-02-12T05:53:17Z"}'

# 3) Analytics
curl -s "${process.env.NEXT_PUBLIC_API_BASE_URL ?? ""}/v1/analytics/performance/VEHICLE_001"`}
          </pre>
        </section>
      </main>
    </div>
  );
}
