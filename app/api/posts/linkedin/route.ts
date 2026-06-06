import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { makeSlug } from "@/lib/slug";

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user?.isOwner) return NextResponse.json({ error: "Owner only." }, { status: 401 });

  let body: { url?: string; text?: string; imageUrl?: string };
  try { body = await req.json(); } catch { return NextResponse.json({ error: "Invalid request." }, { status: 400 }); }

  const text = (body.text ?? "").trim();
  const url  = (body.url ?? "").trim();
  if (!text) return NextResponse.json({ error: "Paste the post text." }, { status: 400 });

  const images = body.imageUrl?.trim() ? [body.imageUrl.trim()] : [];
  const title = text.split("\n").map(l => l.trim()).find(Boolean)?.slice(0, 90) || "LinkedIn post";

  const post = await prisma.post.create({
    data: {
      title,
      body: text,
      images,
      slug: makeSlug(title),
      authorId: user.id,
      kind: "linkedin",
      externalUrl: url || null,
    },
    select: { slug: true },
  });

  return NextResponse.json({ post });
}
