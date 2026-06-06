import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { BlogNav } from "@/components/BlogNav";
import { timeAgo } from "@/lib/format";

export const dynamic = "force-dynamic";
export const metadata = { title: "Inbox" };

export default async function MessagesPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login?next=/messages");
  if (!user.isOwner) redirect("/blog");

  const messages = await prisma.message.findMany({
    where: { toUserId: user.id },
    orderBy: { createdAt: "desc" },
    take: 200,
  });

  // Mark everything read once it's been viewed.
  await prisma.message.updateMany({
    where: { toUserId: user.id, read: false },
    data: { read: true },
  });

  return (
    <>
      <BlogNav user={user} />
      <main className="mx-auto w-full max-w-2xl flex-1 px-5 py-8">
        <h1 className="text-2xl font-semibold tracking-tight">Inbox</h1>
        <p className="mt-1 text-sm text-muted">
          {messages.length} {messages.length === 1 ? "message" : "messages"}
        </p>

        {messages.length === 0 ? (
          <div className="mt-8 rounded-2xl border border-dashed border-border p-10 text-center text-sm text-muted">
            No messages yet.
          </div>
        ) : (
          <ul className="mt-6 space-y-3">
            {messages.map((m) => (
              <li
                key={m.id}
                className={`rounded-2xl border bg-surface p-4 ${
                  m.read ? "border-border" : "border-border-strong"
                }`}
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <span className="text-sm font-medium text-foreground">
                      {m.fromName || "Anonymous"}
                    </span>
                    {m.fromEmail && (
                      <a
                        href={`mailto:${m.fromEmail}`}
                        className="ml-2 text-xs text-muted-2 hover:text-foreground"
                      >
                        {m.fromEmail}
                      </a>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    {!m.read && (
                      <span className="h-2 w-2 rounded-full bg-sky-400" />
                    )}
                    <span className="shrink-0 text-xs text-muted-2">
                      {timeAgo(m.createdAt)}
                    </span>
                  </div>
                </div>
                <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-muted">
                  {m.body}
                </p>
                {m.fromEmail && (
                  <a
                    href={`mailto:${m.fromEmail}?subject=Re: your message`}
                    className="mt-3 inline-block text-xs text-muted transition-colors hover:text-foreground"
                  >
                    Reply by email →
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
