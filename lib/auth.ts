import "server-only";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import { SignJWT, jwtVerify } from "jose";
import { prisma } from "./db";

const COOKIE = "session";
const THIRTY_DAYS = 60 * 60 * 24 * 30;

function secret() {
  const s = process.env.AUTH_SECRET;
  if (!s) throw new Error("AUTH_SECRET is not set");
  return new TextEncoder().encode(s);
}

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 11);
}

export async function verifyPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}

// Sign a JWT and drop it in an httpOnly cookie that lasts 30 days, so the
// user stays logged in (auto-login on return) until it expires.
export async function createSession(userId: string) {
  const token = await new SignJWT({ uid: userId })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("30d")
    .sign(secret());

  const jar = await cookies();
  jar.set(COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: THIRTY_DAYS,
  });
}

export async function destroySession() {
  const jar = await cookies();
  jar.delete(COOKIE);
}

export async function getSessionUserId(): Promise<string | null> {
  const jar = await cookies();
  const token = jar.get(COOKIE)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secret());
    return (payload.uid as string) ?? null;
  } catch {
    return null;
  }
}

export type SessionUser = {
  id: string;
  email: string;
  displayName: string;
  avatarUrl: string | null;
  isOwner: boolean;
};

export async function getCurrentUser(): Promise<SessionUser | null> {
  const uid = await getSessionUserId();
  if (!uid) return null;
  const user = await prisma.user.findUnique({
    where: { id: uid },
    select: {
      id: true,
      email: true,
      displayName: true,
      avatarUrl: true,
      isOwner: true,
    },
  });
  return user;
}

export function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}
