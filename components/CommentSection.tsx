"use client";

import { useState } from "react";
import Link from "next/link";
import { Avatar } from "@/components/Avatar";
import { timeAgo, initialsOf } from "@/lib/format";

type Comment = {
  id: string;
  body: string;
  createdAt: string | Date;
  author: { displayName: string; isOwner: boolean };
};

export function CommentSection({
  postId,
  initial,
  canComment,
}: {
  postId: string;
  initial: Comment[];
  canComment: boolean;
}) {
  const [comments, setComments] = useState<Comment[]>(initial);
  const [body, setBody] = useState("");
  const [posting, setPosting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!body.trim()) return;
    setPosting(true);
    setError(null);
    try {
      const res = await fetch(`/api/posts/${postId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ body }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Couldn't comment.");
        return;
      }
      setComments((c) => [...c, data.comment]);
      setBody("");
    } catch {
      setError("Network error — try again.");
    } finally {
      setPosting(false);
    }
  }

  return (
    <section id="comments" className="scroll-mt-20">
      <h2 className="text-sm font-medium text-foreground">
        {comments.length} {comments.length === 1 ? "comment" : "comments"}
      </h2>

      {canComment ? (
        <form onSubmit={submit} className="mt-4">
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Add a comment…"
            rows={3}
            className="w-full resize-none rounded-xl border border-border bg-surface px-3.5 py-2.5 text-sm outline-none transition-colors placeholder:text-muted-2 focus:border-border-strong"
          />
          {error && <p className="mt-1.5 text-xs text-red-400">{error}</p>}
          <div className="mt-2 flex justify-end">
            <button
              type="submit"
              disabled={posting || !body.trim()}
              className="rounded-full bg-foreground px-4 py-1.5 text-sm font-medium text-background transition-opacity hover:opacity-90 disabled:opacity-40"
            >
              {posting ? "Posting…" : "Comment"}
            </button>
          </div>
        </form>
      ) : (
        <p className="mt-4 rounded-xl border border-border bg-surface px-4 py-3 text-sm text-muted">
          <Link href="/login" className="prose-link">
            Log in
          </Link>{" "}
          or{" "}
          <Link href="/signup" className="prose-link">
            sign up
          </Link>{" "}
          to join the conversation.
        </p>
      )}

      <ul className="mt-6 space-y-5">
        {comments.map((c) => (
          <li key={c.id} className="flex gap-3">
            <Avatar initials={initialsOf(c.author.displayName)} size={32} />
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-medium text-foreground">
                  {c.author.displayName}
                </span>
                {c.author.isOwner && (
                  <span className="rounded-full bg-surface-2 px-1.5 py-0.5 text-[10px] text-muted">
                    author
                  </span>
                )}
                <span className="text-xs text-muted-2">
                  · {timeAgo(c.createdAt)}
                </span>
              </div>
              <p className="mt-1 whitespace-pre-wrap text-sm leading-relaxed text-muted">
                {c.body}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
