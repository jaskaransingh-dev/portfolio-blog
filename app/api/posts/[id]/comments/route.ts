import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json(
      { error: "Log in to comment." },
      { status: 401 },
    );
  }

  const { id } = await params;
  let body: { body?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const text = (body.body ?? "").trim();
  if (!text) {
    return NextResponse.json({ error: "Say something." }, { status: 400 });
  }

  const post = await prisma.post.findUnique({ where: { id }, select: { id: true } });
  if (!post) {
    return NextResponse.json({ error: "Post not found." }, { status: 404 });
  }

  const comment = await prisma.comment.create({
    data: { body: text, postId: id, authorId: user.id },
    select: {
      id: true,
      body: true,
      createdAt: true,
      author: { select: { displayName: true, isOwner: true } },
    },
  });

  return NextResponse.json({ comment });
}
