import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import {
  createSession,
  normalizeEmail,
  verifyPassword,
} from "@/lib/auth";

export async function POST(req: Request) {
  let body: { email?: string; password?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const email = normalizeEmail(body.email ?? "");
  const password = body.password ?? "";

  const user = await prisma.user.findUnique({ where: { email } });
  // Empty hash = unclaimed owner placeholder; treat as no account.
  if (!user || user.passwordHash === "") {
    return NextResponse.json(
      { error: "No account with that email. Want to sign up?" },
      { status: 401 },
    );
  }

  const ok = await verifyPassword(password, user.passwordHash);
  if (!ok) {
    return NextResponse.json(
      { error: "That password doesn't match." },
      { status: 401 },
    );
  }

  await createSession(user.id);

  return NextResponse.json({
    user: {
      id: user.id,
      email: user.email,
      displayName: user.displayName,
      isOwner: user.isOwner,
    },
  });
}
