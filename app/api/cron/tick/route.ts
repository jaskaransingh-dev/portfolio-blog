import { NextResponse } from "next/server";
import { runBotTick } from "@/lib/bots";
import { aiDiag } from "@/lib/ai";
import { getCurrentUser } from "@/lib/auth";

export const dynamic = "force-dynamic";
export const maxDuration = 120;

async function authorize(req: Request): Promise<boolean> {
  const secret = process.env.CRON_SECRET;
  if (secret) {
    const auth = req.headers.get("authorization");
    const key = new URL(req.url).searchParams.get("key");
    if (auth === `Bearer ${secret}` || key === secret) return true;
  }
  const user = await getCurrentUser();
  return !!user?.isOwner;
}

async function handle(req: Request) {
  if (!(await authorize(req))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (new URL(req.url).searchParams.get("diag") === "1") {
    return NextResponse.json(await aiDiag());
  }

  // Allow a small catch-up batch (e.g. a 5-minute external driver -> n=5).
  const n = Math.min(
    Math.max(parseInt(new URL(req.url).searchParams.get("n") || "1", 10) || 1, 1),
    8,
  );

  const results = [];
  for (let i = 0; i < n; i++) {
    try {
      results.push(await runBotTick());
    } catch (e) {
      results.push({ ok: false, action: "error", detail: (e as Error).message });
    }
  }

  return NextResponse.json({ ran: results.length, results });
}

export const GET = handle;
export const POST = handle;
