import Link from "next/link";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { SiteNav } from "@/components/SiteNav";
import { Avatar } from "@/components/Avatar";
import { timeAgo, initialsOf } from "@/lib/format";

export const dynamic = "force-dynamic";
export const metadata = { title: "Profile" };

export default async function DashPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login?next=/dash");

  const [posts, totalComments] = await Promise.all([
    prisma.post.findMany({
      where: { authorId: user.id, published: true },
      orderBy: { createdAt: "desc" },
      take: 20,
      select: {
        id: true, slug: true, title: true, createdAt: true,
        _count: { select: { comments: true } },
      },
    }),
    prisma.comment.count({ where: { authorId: user.id } }),
  ]);

  return (
    <>
      <SiteNav user={user} />
      <main className="mx-auto w-full max-w-xl flex-1 px-5 py-10">

        {/* Profile card */}
        <div className="anim-fade-up rounded-2xl border border-border bg-surface p-6 flex items-start gap-4">
          <Avatar src={user.avatarUrl} initials={initialsOf(user.displayName)} size={56} />
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-text">{user.displayName}</p>
            <p className="text-xs mt-0.5" style={{ color: "var(--muted-2)" }}>{user.email}</p>
            {user.isOwner && (
              <span className="badge-orange mt-2 inline-flex">owner</span>
            )}
            <div className="mt-3 flex items-center gap-5 text-xs" style={{ color: "var(--muted)" }}>
              <span>{posts.length} posts</span>
              <span>{totalComments} comments</span>
            </div>
          </div>
        </div>

        {/* Quick links for owner */}
        {user.isOwner && (
          <div className="mt-4 anim-fade-up" style={{ animationDelay: "0.05s" }}>
            <div className="rounded-2xl border border-orange-mid bg-orange-dim px-5 py-4 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
              <Link href="/lab"     className="link font-medium">The Lab</Link>
              <Link href="/messages" className="link font-medium">Inbox</Link>
              <Link href="/import"  className="link font-medium">Import from LinkedIn</Link>
              <Link href="/portfolio" className="link font-medium" target="_blank">View portfolio</Link>
            </div>
          </div>
        )}

        {/* Posts */}
        <div className="mt-8">
          <p className="text-xs uppercase tracking-widest mb-4" style={{ color: "var(--muted-2)" }}>
            Your posts
          </p>

          {posts.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border p-10 text-center text-sm" style={{ color: "var(--muted)" }}>
              Nothing posted yet.{" "}
              <Link href="/" className="link">Write something.</Link>
            </div>
          ) : (
            <ul className="anim-stagger space-y-px">
              {posts.map(p => (
                <li key={p.id} className="border-b border-border py-4 last:border-0">
                  <div className="flex items-start justify-between gap-3">
                    <Link
                      href={`/posts/${p.slug}`}
                      className="text-sm font-medium text-text hover:text-orange transition-colors flex-1 min-w-0 line-clamp-1"
                    >
                      {p.title}
                    </Link>
                    <div className="flex items-center gap-3 text-xs flex-shrink-0" style={{ color: "var(--muted-2)" }}>
                      <span>{p._count.comments} comments</span>
                      <span>{timeAgo(p.createdAt)}</span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Account section */}
        <div className="mt-10 pt-8 border-t border-border text-sm" style={{ color: "var(--muted-2)" }}>
          <p className="text-xs uppercase tracking-widest mb-4" style={{ color: "var(--muted-2)" }}>
            Account
          </p>
          <div className="flex flex-col gap-3">
            <Link href="/forgot-password" className="hover:text-orange transition-colors w-fit">
              Change password
            </Link>
            <Link href="/contact" className="hover:text-orange transition-colors w-fit">
              Contact / help
            </Link>
          </div>
        </div>

      </main>
    </>
  );
}
