import { NextResponse } from "next/server";
import { getPinned } from "@/lib/github";
import { BRAND } from "@/lib/brand";

export const runtime = "nodejs"; // token stays server-side
export const revalidate = 60;

export async function GET() {
  const out = await getPinned(BRAND.githubUsername);
  // surface useful rate info in headers for the client (no secrets)
  const headers = new Headers();
  if (out.rate?.limit) headers.set("x-gh-limit", String(out.rate.limit));
  if (out.rate?.remaining !== undefined) headers.set("x-gh-remaining", String(out.rate.remaining));
  if (out.rate?.reset) headers.set("x-gh-reset", String(out.rate.reset));
  return NextResponse.json(out, { headers });
}
