import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { makeSlug } from "@/lib/slug";

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json(
      { error: "You need to be logged in to post." },
      { status: 401 },
    );
  }

  let body: { title?: string; body?: string; images?: string[] };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const title = (body.title ?? "").trim();
  const text = (body.body ?? "").trim();
  const images = Array.isArray(body.images)
    ? body.images.filter((u) => typeof u === "string").slice(0, 8)
    : [];

  if (!text && !title && images.length === 0) {
    return NextResponse.json(
      { error: "Write something or add an image first." },
      { status: 400 },
    );
  }

  const derivedTitle =
    title || text.split("\n")[0].slice(0, 80) || "Untitled";

  const post = await prisma.post.create({
    data: {
      title: derivedTitle,
      body: text,
      images,
      slug: makeSlug(title || text || "post"),
      authorId: user.id,
    },
    select: { slug: true },
  });

  return NextResponse.json({ post });
}
