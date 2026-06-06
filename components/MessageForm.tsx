"use client";

import { useState } from "react";

export function MessageForm({
  compact = false, defaultName = "", defaultEmail = "", loggedIn = false,
}: {
  compact?: boolean; defaultName?: string; defaultEmail?: string; loggedIn?: boolean;
}) {
  const [name,    setName]    = useState(defaultName);
  const [email,   setEmail]   = useState(defaultEmail);
  const [body,    setBody]    = useState("");
  const [sending, setSending] = useState(false);
  const [sent,    setSent]    = useState(false);
  const [error,   setError]   = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!body.trim()) return;
    setSending(true); setError(null);
    const res  = await fetch("/api/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, body }),
    });
    const data = await res.json();
    setSending(false);
    if (!res.ok) { setError(data.error ?? "Could not send."); return; }
    setSent(true); setBody("");
  }

  if (sent) {
    return (
      <div className="rounded-xl border border-border px-4 py-6 text-center text-sm text-muted">
        Message sent.
        <button onClick={() => setSent(false)} className="mt-2 block w-full text-xs text-muted-2 hover:text-text transition-colors">
          Send another
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-3">
      {!loggedIn && (
        <div className={compact ? "space-y-3" : "grid gap-3 sm:grid-cols-2"}>
          <input value={name} onChange={e => setName(e.target.value)} placeholder="Your name" className="input" />
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email (optional, for a reply)" className="input" />
        </div>
      )}
      <textarea
        value={body} onChange={e => setBody(e.target.value)}
        placeholder="Your message..."
        rows={compact ? 3 : 5}
        className="input resize-none"
      />
      {error && <p className="text-xs text-red-400">{error}</p>}
      <div className="flex justify-end">
        <button type="submit" disabled={sending || !body.trim()} className="btn-primary py-2 px-5 text-sm">
          {sending ? "Sending..." : "Send"}
        </button>
      </div>
    </form>
  );
}
