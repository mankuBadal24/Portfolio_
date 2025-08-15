import { NextRequest, NextResponse } from "next/server";
import { getRepos } from "@/lib/github";
import { BRAND } from "@/lib/brand";

export const runtime = "nodejs";
export const revalidate = 60;

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const cursor = searchParams.get("cursor");
  const perPage = Number(searchParams.get("perPage") || 12);
  const sort = (searchParams.get("sort") || "updated") as "updated" | "stars";
  const language = searchParams.get("language") || undefined;
  const q = searchParams.get("q") || undefined;

  const out = await getRepos({
    username: BRAND.githubUsername,
    cursor,
    perPage,
    sort,
    language,
    q
  });

  const headers = new Headers();
  if (out.rate?.limit) headers.set("x-gh-limit", String(out.rate.limit));
  if (out.rate?.remaining !== undefined) headers.set("x-gh-remaining", String(out.rate.remaining));
  if (out.rate?.reset) headers.set("x-gh-reset", String(out.rate.reset));

  return NextResponse.json(out, { headers });
}
