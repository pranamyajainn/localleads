import { NextRequest, NextResponse } from "next/server";

export async function GET(_req: NextRequest) {
  return NextResponse.redirect(new URL("/dashboard?payment=pending", process.env.NEXT_PUBLIC_BASE_URL ?? "https://localleads.sahajta.com"));
}
