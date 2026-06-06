"use client";

import { useState } from "react";

export function MessageForm({
  compact = false,
  defaultName = "",
  defaultEmail = "",
  loggedIn = false,
}: {
  compact?: boolean;
  defaultName?: string;
  defaultEmail?: string;
  loggedIn?: boolean;
}) {
  const [name, setName] = useState(defaultName);
  const [email, setEmail] = useState(defaultEmail);
  const [body, setBody] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!body.trim()) return;
    setSending(true);
    setError(null);
    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, body }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Couldn't send.");
        return;
      }
      setSent(true);
      setBody("");
    } catch {
      setError("Network error — try again.");
    } finally {
      setSending(false);
    }
  }

  if (sent) {
    return (
      <div className="rounded-xl border border-border bg-surface px-4 py-6 text-center text-sm text-muted">
        ✅ Message sent. Jaz will get back to you.
        <button
          onClick={() => setSent(false)}
          className="mt-2 block w-full text-xs text-muted-2 hover:text-foreground"
        >
          Send another
        </button>
      </div>
    );
  }

  const input =
    "w-full rounded-lg border border-border bg-surface px-3.5 py-2.5 text-sm outline-none transition-colors placeholder:text-muted-2 focus:border-border-strong";

  return (
    <form onSubmit={submit} className="space-y-3">
      {!loggedIn && (
        <div className={compact ? "space-y-3" : "grid gap-3 sm:grid-cols-2"}>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            className={input}
          />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email (so Jaz can reply)"
            className={input}
          />
        </div>
      )}
      <textarea
        value={body}
        onChange={(e) => setBody(e.target.value)}
        placeholder="Your message…"
        rows={compact ? 3 : 5}
        className={`${input} resize-none`}
      />
      {error && <p className="text-xs text-red-400">{error}</p>}
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={sending || !body.trim()}
          className="rounded-full bg-foreground px-5 py-2 text-sm font-medium text-background transition-opacity hover:opacity-90 disabled:opacity-40"
        >
          {sending ? "Sending…" : "Send message"}
        </button>
      </div>
    </form>
  );
}
