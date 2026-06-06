import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { BlogNav } from "@/components/BlogNav";
import { Avatar } from "@/components/Avatar";
import { ImageGrid } from "@/components/ImageGrid";
import { CommentSection } from "@/components/CommentSection";
import { MessageForm } from "@/components/MessageForm";
import { timeAgo, initialsOf } from "@/lib/format";

export const dynamic = "force-dynamic";

async function getPost(slug: string) {
  try {
    return await prisma.post.findUnique({
      where: { slug },
      include: {
        author: {
          select: {
            displayName: true,
            avatarUrl: true,
            isOwner: true,
            bio: true,
          },
        },
        comments: {
          orderBy: { createdAt: "asc" },
          select: {
            id: true,
            body: true,
            createdAt: true,
            author: { select: { displayName: true, isOwner: true } },
          },
        },
      },
    });
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return { title: "Post not found" };
  return {
    title: post.title,
    description: post.body.slice(0, 150),
  };
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [post, user] = await Promise.all([getPost(slug), getCurrentUser()]);
  if (!post) notFound();

  return (
    <>
      <BlogNav user={user} />
      <main className="mx-auto w-full max-w-2xl flex-1 px-5 py-8">
        <Link
          href="/blog"
          className="text-xs text-muted-2 transition-colors hover:text-foreground"
        >
          ← All posts
        </Link>

        <article className="mt-5">
          <div className="flex items-center gap-3">
            <Avatar
              src={post.author.avatarUrl}
              initials={initialsOf(post.author.displayName)}
              size={40}
            />
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-medium text-foreground">
                  {post.author.displayName}
                </span>
                {post.author.isOwner && (
                  <span className="rounded-full bg-surface-2 px-1.5 py-0.5 text-[10px] text-muted">
                    author
                  </span>
                )}
              </div>
              <span className="text-xs text-muted-2">
                {timeAgo(post.createdAt)}
              </span>
            </div>
          </div>

          <h1 className="mt-5 text-2xl font-semibold leading-tight tracking-tight">
            {post.title}
          </h1>

          {post.body && (
            <div className="mt-4 whitespace-pre-wrap text-[16px] leading-[1.75] text-foreground/90">
              {post.body}
            </div>
          )}

          {post.images.length > 0 && (
            <div className="mt-6">
              <ImageGrid images={post.images} />
            </div>
          )}
        </article>

        <div className="my-10 border-t border-border" />

        <CommentSection
          postId={post.id}
          initial={post.comments}
          canComment={!!user}
        />

        {/* Message the author */}
        <div className="mt-12 rounded-2xl border border-border bg-surface p-5">
          <h2 className="text-sm font-medium text-foreground">
            Message {post.author.isOwner ? "Jaz" : post.author.displayName}
          </h2>
          <p className="mt-1 text-xs text-muted">
            Goes straight to Jaz&apos;s inbox. No account needed.
          </p>
          <div className="mt-4">
            <MessageForm
              compact
              defaultName={user?.displayName ?? ""}
              defaultEmail={user?.email ?? ""}
              loggedIn={!!user}
            />
          </div>
        </div>
      </main>
    </>
  );
}
