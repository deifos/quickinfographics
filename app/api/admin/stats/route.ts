import { NextResponse } from "next/server";

// Admin stats are fetched directly via Convex useQuery on the client.
// This route is a placeholder for future server-side admin API needs.
export async function GET() {
  return NextResponse.json({ error: "Use Convex queries directly" }, { status: 404 });
}
