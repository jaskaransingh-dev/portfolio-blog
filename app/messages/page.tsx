import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { SiteNav } from "@/components/SiteNav";
import { timeAgo } from "@/lib/format";

export const dynamic = "force-dynamic";
export const metadata = { title: "Inbox" };

export default async function MessagesPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login?next=/messages");
  if (!user.isOwner) redirect("/");

  const messages = await prisma.message.findMany({
    where: { toUserId: user.id },
    orderBy: { createdAt: "desc" },
    take: 200,
  });

  await prisma.message.updateMany({
    where: { toUserId: user.id, read: false },
    data: { read: true },
  });

  return (
    <>
      <SiteNav user={user} />
      <main className="mx-auto w-full max-w-2xl flex-1 px-5 py-10">
        <h1 className="serif text-2xl font-normal">Inbox</h1>
        <p className="mt-1 text-sm text-muted">{messages.length} messages</p>

        {messages.length === 0 ? (
          <div className="mt-8 rounded-xl border border-dashed border-border p-12 text-center text-sm text-muted">
            No messages yet.
          </div>
        ) : (
          <ul className="mt-6 space-y-3">
            {messages.map(m => (
              <li
                key={m.id}
                className={`rounded-xl border bg-surface p-4 ${m.read ? "border-border" : "border-border-strong"}`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="text-sm font-medium text-text">
                      {m.fromName || "Anonymous"}
                    </span>
                    {m.fromEmail && (
                      <a href={`mailto:${m.fromEmail}`} className="ml-2 text-xs text-muted-2 hover:text-text transition-colors">
                        {m.fromEmail}
                      </a>
                    )}
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {!m.read && <span className="h-1.5 w-1.5 rounded-full bg-amber" />}
                    <span className="text-xs text-muted-2">{timeAgo(m.createdAt)}</span>
                  </div>
                </div>
                <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-muted">{m.body}</p>
                {m.fromEmail && (
                  <a
                    href={`mailto:${m.fromEmail}?subject=Re: your message`}
                    className="mt-3 inline-block text-xs text-muted hover:text-text transition-colors"
                  >
                    Reply by email
                  </a>
                )}
              </li>
            ))}
          </ul>
        )}
      </main>
    </>
  );
}
