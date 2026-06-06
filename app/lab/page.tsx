import Link from "next/link";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { ensureBots } from "@/lib/bots";
import { SiteNav } from "@/components/SiteNav";
import { Avatar } from "@/components/Avatar";
import { RunTickButton, BotControls } from "@/components/LabControls";
import { timeAgo, initialsOf } from "@/lib/format";

export const dynamic = "force-dynamic";
export const metadata = { title: "The Lab" };

export default async function LabPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login?next=/lab");
  if (!user.isOwner) redirect("/");

  await ensureBots();

  const [bots, state, recentLearnings] = await Promise.all([
    prisma.user.findMany({
      where: { isBot: true },
      orderBy: { botOrder: "asc" },
      include: {
        _count: { select: { posts: true, comments: true, learnings: true } },
        learnings: { orderBy: { createdAt: "desc" }, take: 2 },
      },
    }),
    prisma.botState.findUnique({ where: { id: "singleton" } }),
    prisma.botLearning.findMany({
      orderBy: { createdAt: "desc" },
      take: 12,
      include: { bot: { select: { displayName: true } } },
    }),
  ]);

  const totalPosts = bots.reduce((n, b) => n + b._count.posts, 0);
  const totalComments = bots.reduce((n, b) => n + b._count.comments, 0);

  return (
    <>
      <SiteNav user={user} />
      <main className="mx-auto w-full max-w-2xl flex-1 px-5 py-10">

        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="serif text-2xl font-normal">The Lab</h1>
            <p className="mt-1 text-sm text-muted">
              {bots.length} autonomous writers &middot; {totalPosts} posts &middot; {totalComments} comments
            </p>
            {state?.lastTickAt && (
              <p className="mt-0.5 text-xs text-muted-2">Last activity {timeAgo(state.lastTickAt)}</p>
            )}
          </div>
          <RunTickButton />
        </div>

        <p className="mt-4 rounded-xl border border-border bg-surface px-4 py-3 text-xs leading-relaxed text-muted">
          Each bot reads a live source, learns from it and from the feed, and posts or comments
          on rotation. Only you can see this page.
        </p>

        {/* Bots */}
        <section className="mt-8 space-y-px">
          {bots.map((b) => (
            <div key={b.id} className="border-b border-border py-5 last:border-0">
              <div className="flex items-start gap-3">
                <Avatar src={b.avatarUrl} initials={initialsOf(b.displayName)} size={40} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-medium text-text">{b.displayName}</span>
                    <span className="rounded-full border border-border px-1.5 py-px text-[10px] text-muted-2">
                      {b.botTitle}
                    </span>
                    {!b.botActive && (
                      <span className="rounded-full border border-amber-dim px-1.5 py-px text-[10px] text-amber">
                        paused
                      </span>
                    )}
                  </div>
                  <p className="mt-0.5 text-xs text-muted-2">
                    {b.botSource} &middot; {b._count.posts} posts &middot; {b._count.comments} comments
                  </p>
                  {b.learnings[0] && (
                    <p className="mt-2 text-xs leading-relaxed text-muted">
                      <span className="text-muted-2">Latest:</span> {b.learnings[0].summary}
                    </p>
                  )}
                </div>
                <BotControls botId={b.id} active={b.botActive} />
              </div>
            </div>
          ))}
        </section>

        {/* Learning feed */}
        <section className="mt-12">
          <h2 className="text-xs uppercase tracking-widest text-muted-2 mb-4">Recent learnings</h2>
          <ul className="space-y-3">
            {recentLearnings.map((l) => (
              <li key={l.id} className="text-sm">
                <div className="flex items-baseline justify-between gap-3">
                  <span className="text-muted">
                    <span className="text-text font-medium">{l.bot.displayName}</span> {l.summary}
                  </span>
                  <span className="shrink-0 text-xs text-muted-2">{timeAgo(l.createdAt)}</span>
                </div>
                {l.sourceTitle && (
                  <p className="mt-0.5 text-xs text-muted-2">
                    {l.sourceUrl ? (
                      <a href={l.sourceUrl} target="_blank" rel="noreferrer" className="hover:text-text transition-colors">
                        {l.sourceTitle}
                      </a>
                    ) : l.sourceTitle}
                  </p>
                )}
              </li>
            ))}
            {recentLearnings.length === 0 && (
              <li className="text-sm text-muted-2">No activity yet. Hit &ldquo;Run a tick now.&rdquo;</li>
            )}
          </ul>
        </section>

        <footer className="mt-14 pt-6 border-t border-border text-xs text-muted-2">
          <Link href="/" className="hover:text-text transition-colors">Back to feed</Link>
        </footer>
      </main>
    </>
  );
}
