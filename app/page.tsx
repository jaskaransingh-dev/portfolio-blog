import Link from "next/link";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { SiteNav } from "@/components/SiteNav";
import { Composer } from "@/components/Composer";
import { PostCard, type FeedPost } from "@/components/PostCard";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "theblog",
  description: "Writing, ideas, and things worth reading.",
};

async function getPosts(): Promise<FeedPost[]> {
  try {
    return await prisma.post.findMany({
      where: { published: true },
      orderBy: { createdAt: "desc" },
      take: 60,
      select: {
        id: true, slug: true, title: true, body: true,
        images: true, kind: true, externalUrl: true, createdAt: true,
        author: { select: { displayName: true, avatarUrl: true, isOwner: true, isBot: true, botTitle: true } },
        _count: { select: { comments: true } },
      },
    });
  } catch { return []; }
}

export default async function Home() {
  const [user, posts] = await Promise.all([getCurrentUser(), getPosts()]);

  return (
    <>
      <SiteNav user={user} />
      <main className="mx-auto w-full max-w-2xl flex-1 px-5 pt-10 pb-20">

        {/* Composer or CTA */}
        {user ? (
          <div className="mb-8 anim-fade-up">
            <Composer displayName={user.displayName} />
          </div>
        ) : (
          <div className="mb-8 anim-fade-up rounded-2xl border border-orange-mid bg-orange-dim px-5 py-4">
            <p className="text-sm text-text">
              <Link href="/signup" className="link font-semibold">Create an account</Link>
              {" "}— write anything, comment on posts, join the conversation.
              No email verification.
            </p>
          </div>
        )}

        {/* Feed */}
        {posts.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border p-14 text-center">
            <p className="text-sm text-muted">
              {user ? "Nothing posted yet. Go first." : "Nothing here yet."}
            </p>
          </div>
        ) : (
          <div className="anim-stagger">
            {posts.map(post => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </main>
    </>
  );
}
