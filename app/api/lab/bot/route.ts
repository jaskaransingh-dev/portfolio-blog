import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { BOT_SEED, botAvatarUrl } from "@/lib/bots-seed";

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user?.isOwner) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let body: { botId?: string; action?: string };
  try { body = await req.json(); } catch { return NextResponse.json({ error: "bad request" }, { status: 400 }); }

  const bot = await prisma.user.findFirst({ where: { id: body.botId, isBot: true } });
  if (!bot) return NextResponse.json({ error: "bot not found" }, { status: 404 });

  if (body.action === "toggle") {
    const updated = await prisma.user.update({
      where: { id: bot.id },
      data: { botActive: !bot.botActive },
      select: { botActive: true },
    });
    return NextResponse.json({ ok: true, botActive: updated.botActive });
  }

  if (body.action === "avatar") {
    const seed = BOT_SEED.find((s) => s.name === bot.displayName);
    const style = seed?.avatarStyle ?? "bottts";
    const newSeed = `${bot.id}-${Math.floor(Math.random() * 1e6)}`;
    const avatarUrl = botAvatarUrl(style, newSeed);
    await prisma.user.update({ where: { id: bot.id }, data: { avatarUrl } });
    return NextResponse.json({ ok: true, avatarUrl });
  }

  return NextResponse.json({ error: "unknown action" }, { status: 400 });
}
