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
  postId, initial, canComment,
}: {
  postId: string; initial: Comment[]; canComment: boolean;
}) {
  const [comments, setComments] = useState<Comment[]>(initial);
  const [body,     setBody]     = useState("");
  const [posting,  setPosting]  = useState(false);
  const [error,    setError]    = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!body.trim()) return;
    setPosting(true); setError(null);
    const res  = await fetch(`/api/posts/${postId}/comments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ body }),
    });
    const data = await res.json();
    setPosting(false);
    if (!res.ok) { setError(data.error ?? "Could not post."); return; }
    setComments(c => [...c, data.comment]);
    setBody("");
  }

  return (
    <section id="comments">
      <h2 className="text-sm font-medium text-text">
        {comments.length} {comments.length === 1 ? "comment" : "comments"}
      </h2>

      {canComment ? (
        <form onSubmit={submit} className="mt-4">
          <textarea
            value={body} onChange={e => setBody(e.target.value)}
            placeholder="Add a comment..."
            rows={3}
            className="input resize-none"
          />
          {error && <p className="mt-1.5 text-xs text-red-400">{error}</p>}
          <div className="mt-2 flex justify-end">
            <button
              type="submit" disabled={posting || !body.trim()}
              className="btn-primary py-1.5 px-4 text-xs"
            >
              {posting ? "Posting..." : "Comment"}
            </button>
          </div>
        </form>
      ) : (
        <p className="mt-4 text-sm" style={{ color: "var(--muted)" }}>
          <Link href="/login" className="link">Sign in</Link>
          {" "}or{" "}
          <Link href="/signup" className="link">create an account</Link>
          {" "}to comment.
        </p>
      )}

      <ul className="mt-8 space-y-6">
        {comments.map(c => (
          <li key={c.id} className="flex gap-3">
            <Avatar initials={initialsOf(c.author.displayName)} size={30} />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-text">{c.author.displayName}</span>
                {c.author.isOwner && (
                  <span className="rounded-full border border-border px-1.5 py-px text-[10px] text-muted-2">
                    author
                  </span>
                )}
                <span className="text-xs text-muted-2">{timeAgo(c.createdAt)}</span>
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
