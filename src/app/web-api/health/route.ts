import { NextResponse } from "next/server";

// Liveness and readiness probe target for Kubernetes. No dependencies are
// checked, so a Telegram outage never restarts the pod.
export const dynamic = "force-dynamic";

export function GET() {
  return NextResponse.json(
    { status: "ok", version: process.env.APP_VERSION || "dev" },
    { headers: { "Cache-Control": "no-store" } },
  );
}
