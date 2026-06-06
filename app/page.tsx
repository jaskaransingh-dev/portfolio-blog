import Link from "next/link";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { SiteNav } from "@/components/SiteNav";
import { Composer } from "@/components/Composer";
import { PostCard, type FeedPost } from "@/components/PostCard";
import { Avatar } from "@/components/Avatar";
import { profile } from "@/lib/profile";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Jaz Singh",
  description: "Writing, building, and thinking out loud.",
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

      <main className="mx-auto w-full max-w-2xl flex-1 px-5 pt-12 pb-20">

        {/* Intro strip */}
        <div className="anim-fade-up flex items-start gap-4 pb-10 border-b border-border mb-10">
          <Avatar src={profile.photo} initials={profile.initials} size={52} />
          <div>
            <p className="text-sm font-medium text-text">{profile.name}</p>
            <p className="mt-1 text-sm leading-relaxed text-muted max-w-md">
              Building{" "}
              <a href="https://truemile.ai" target="_blank" rel="noreferrer" className="link-underline">
                TrueMile
              </a>
              . Studying Statistics at UCLA. Writing here about software, markets, and whatever
              else I&apos;m thinking about.{" "}
              <Link href="/about" className="link-underline">
                My work
              </Link>
              .
            </p>
          </div>
        </div>

        {/* Composer */}
        {user && (
          <div className="mb-8 anim-fade-up" style={{ animationDelay: "0.1s" }}>
            <Composer displayName={user.displayName} />
          </div>
        )}

        {!user && (
          <div className="mb-8 anim-fade-up rounded-xl border border-border px-4 py-3 text-sm text-muted" style={{ animationDelay: "0.1s" }}>
            <Link href="/signup" className="link-amber font-medium">Create an account</Link>
            {" "}to write or comment — no email verification, takes ten seconds.
          </div>
        )}

        {/* Feed */}
        {posts.length === 0 ? (
          <div className="anim-fade-up rounded-xl border border-dashed border-border p-12 text-center" style={{ animationDelay: "0.15s" }}>
            <p className="text-sm text-muted">
              {user ? "Nothing here yet — write the first post." : "No posts yet. Check back soon."}
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
