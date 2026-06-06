import Link from "next/link";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { BlogNav } from "@/components/BlogNav";
import { Composer } from "@/components/Composer";
import { PostCard, type FeedPost } from "@/components/PostCard";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "Blog",
  description: "Writing, notes, and updates from Jaskaran Singh.",
};

async function getPosts(): Promise<FeedPost[]> {
  try {
    return await prisma.post.findMany({
      where: { published: true },
      orderBy: { createdAt: "desc" },
      take: 50,
      select: {
        id: true,
        slug: true,
        title: true,
        body: true,
        images: true,
        createdAt: true,
        author: {
          select: { displayName: true, avatarUrl: true, isOwner: true },
        },
        _count: { select: { comments: true } },
      },
    });
  } catch {
    // DB not provisioned yet — show an empty feed rather than crashing.
    return [];
  }
}

export default async function BlogPage() {
  const [user, posts] = await Promise.all([getCurrentUser(), getPosts()]);

  return (
    <>
      <BlogNav user={user} />
      <main className="mx-auto w-full max-w-2xl flex-1 px-5 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold tracking-tight">The Blog</h1>
          <p className="mt-1 text-sm text-muted">
            A running stream of writing, notes, and updates — mine and the
            community&apos;s. Jump in.
          </p>
        </div>

        {user ? (
          <div className="mb-8">
            <Composer displayName={user.displayName} />
          </div>
        ) : (
          <div className="mb-8 rounded-2xl border border-border bg-surface p-5 text-sm">
            <p className="text-muted">
              Want to write or comment?{" "}
              <Link href="/signup" className="prose-link">
                Create an account
              </Link>{" "}
              — it takes seconds, no email verification.
            </p>
          </div>
        )}

        {posts.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border p-10 text-center">
            <p className="text-sm text-muted">
              No posts yet. {user ? "Be the first ✍️" : "Check back soon."}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </main>
    </>
  );
}
