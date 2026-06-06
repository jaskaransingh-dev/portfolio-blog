import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { SiteNav } from "@/components/SiteNav";
import { Avatar } from "@/components/Avatar";
import { ImageGrid } from "@/components/ImageGrid";
import { CommentSection } from "@/components/CommentSection";
import { MessageForm } from "@/components/MessageForm";
import { Markdown } from "@/components/Markdown";
import { timeAgo, initialsOf } from "@/lib/format";

export const dynamic = "force-dynamic";

async function getPost(slug: string) {
  try {
    return await prisma.post.findUnique({
      where: { slug },
      include: {
        author: { select: { displayName: true, avatarUrl: true, isOwner: true, isBot: true, botTitle: true, botPersona: true, bio: true } },
        comments: {
          orderBy: { createdAt: "asc" },
          select: {
            id: true, body: true, createdAt: true,
            author: { select: { displayName: true, isOwner: true } },
          },
        },
      },
    });
  } catch { return null; }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return { title: "Not found" };
  return { title: post.title, description: post.body.slice(0, 155) };
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [post, user] = await Promise.all([getPost(slug), getCurrentUser()]);
  if (!post) notFound();

  return (
    <>
      <SiteNav user={user} />
      <main className="mx-auto w-full max-w-2xl flex-1 px-5 py-10">

        <Link href="/" className="text-xs text-muted-2 hover:text-muted transition-colors">
          Back
        </Link>

        <article className="mt-7">
          {/* Byline */}
          <div className="flex items-center gap-2.5 mb-6">
            <Avatar
              src={post.author.avatarUrl}
              initials={initialsOf(post.author.displayName)}
              size={32}
            />
            <div className="flex items-center gap-2 text-sm">
              <span className="font-medium text-text">{post.author.displayName}</span>
              {post.author.isOwner && (
                <span className="rounded-full border border-border px-1.5 py-px text-[10px] text-muted-2">
                  author
                </span>
              )}
              {post.author.isBot && post.author.botTitle && (
                <span className="rounded-full border border-border px-1.5 py-px text-[10px] text-muted-2">
                  {post.author.botTitle}
                </span>
              )}
              <span className="text-muted-2">·</span>
              <span className="text-muted-2 text-xs">{timeAgo(post.createdAt)}</span>
            </div>
          </div>

          <h1 className="serif text-[2rem] font-normal leading-tight tracking-tight text-text">
            {post.title}
          </h1>

          {post.author.isOwner && post.kind === "linkedin" && post.externalUrl && (
            <a
              href={post.externalUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-4 inline-flex items-center gap-1.5 rounded-full border border-border px-2.5 py-1 text-xs text-muted hover:text-text transition-colors"
            >
              Originally on LinkedIn
            </a>
          )}

          {post.body && (
            <div className="mt-6">
              <Markdown>{post.body}</Markdown>
            </div>
          )}

          {post.images.length > 0 && (
            <div className="mt-8">
              <ImageGrid images={post.images} />
            </div>
          )}
        </article>

        <div className="my-12 border-t border-border" />

        <CommentSection postId={post.id} initial={post.comments} canComment={!!user} />

        <div className="mt-14 rounded-xl border border-border bg-surface p-5">
          <p className="text-sm font-medium text-text mb-1">
            Send a message
          </p>
          <p className="text-xs text-muted mb-4">
            Goes straight to Jaz. No account needed.
          </p>
          <MessageForm
            compact
            defaultName={user?.displayName ?? ""}
            defaultEmail={user?.email ?? ""}
            loggedIn={!!user}
          />
        </div>

      </main>
    </>
  );
}
