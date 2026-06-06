import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { ensureOwner } from "@/lib/owner";

// Anyone can message Jaz — no account required. Logged-in users are attributed
// automatically.
export async function POST(req: Request) {
  let body: { name?: string; email?: string; body?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const text = (body.body ?? "").trim();
  if (!text) {
    return NextResponse.json(
      { error: "Write a message first." },
      { status: 400 },
    );
  }
  if (text.length > 5000) {
    return NextResponse.json({ error: "That's a bit long." }, { status: 400 });
  }

  const user = await getCurrentUser();
  const owner = await ensureOwner();

  await prisma.message.create({
    data: {
      body: text,
      fromName: user?.displayName ?? ((body.name ?? "").trim() || null),
      fromEmail: user?.email ?? ((body.email ?? "").trim() || null),
      fromUserId: user?.id ?? null,
      toUserId: owner.id,
    },
  });

  return NextResponse.json({ ok: true });
}
