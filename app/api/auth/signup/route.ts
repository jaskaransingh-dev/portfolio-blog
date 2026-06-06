import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import {
  createSession,
  hashPassword,
  normalizeEmail,
} from "@/lib/auth";
import { OWNER_EMAIL } from "@/lib/owner";

export async function POST(req: Request) {
  let body: { email?: string; password?: string; displayName?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const email = normalizeEmail(body.email ?? "");
  const password = body.password ?? "";
  const displayName = (body.displayName ?? "").trim() || email.split("@")[0];

  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return NextResponse.json(
      { error: "Enter a valid email." },
      { status: 400 },
    );
  }
  if (password.length < 4) {
    return NextResponse.json(
      { error: "Your password is a little short." },
      { status: 400 },
    );
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  // A non-empty hash means a real account already exists.
  if (existing && existing.passwordHash !== "") {
    return NextResponse.json(
      { error: "That email is already registered. Try logging in." },
      { status: 409 },
    );
  }

  const passwordHash = await hashPassword(password);
  const isOwner = email === OWNER_EMAIL;

  const user = existing
    ? await prisma.user.update({
        where: { id: existing.id },
        data: { passwordHash, displayName },
      })
    : await prisma.user.create({
        data: { email, passwordHash, displayName, isOwner },
      });

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
