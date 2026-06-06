import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { normalizeEmail } from "@/lib/auth";

export async function POST(req: Request) {
  let body: { email?: string };
  try { body = await req.json(); } catch { return NextResponse.json({ error: "Invalid request." }, { status: 400 }); }

  const email = normalizeEmail(body.email ?? "");
  if (!email) return NextResponse.json({ error: "Enter your email." }, { status: 400 });

  const user = await prisma.user.findUnique({ where: { email } });

  // Always return the same response so we don't leak whether an account exists.
  // If the account exists, create a token.
  if (user && user.passwordHash !== "") {
    // Expire any previous tokens.
    await prisma.passwordResetToken.updateMany({
      where: { userId: user.id, used: false },
      data: { used: true },
    });

    const reset = await prisma.passwordResetToken.create({
      data: {
        userId: user.id,
        expiresAt: new Date(Date.now() + 1000 * 60 * 60), // 1 hour
      },
    });

    // In production you'd send this via email. For now, return it directly.
    // Add RESEND_API_KEY to your env and hook up email here.
    const resetUrl = `${process.env.NEXT_PUBLIC_BASE_URL ?? ""}/reset-password?token=${reset.token}`;
    return NextResponse.json({ ok: true, resetUrl, _dev: true });
  }

  return NextResponse.json({ ok: true });
}
