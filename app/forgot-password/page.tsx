"use client";

import { useState } from "react";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [email,   setEmail]   = useState("");
  const [loading, setLoading] = useState(false);
  const [resetUrl,setResetUrl]= useState<string | null>(null);
  const [done,    setDone]    = useState(false);
  const [error,   setError]   = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true); setError(null);
    const res  = await fetch("/api/auth/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) { setError(data.error); return; }
    setDone(true);
    // _dev: show reset link directly since email isn't wired up yet.
    if (data.resetUrl) setResetUrl(data.resetUrl);
  }

  return (
    <main className="flex flex-1 items-center justify-center px-5 py-16">
      <div className="w-full max-w-sm">
        <Link href="/login" className="text-xs text-muted-2 hover:text-text transition-colors">
          Back to sign in
        </Link>

        <h1 className="serif mt-6 text-2xl font-normal">Reset your password</h1>

        {done ? (
          <div className="mt-6 space-y-4">
            <p className="text-sm text-muted">
              If that email is in our system, a reset link has been generated.
            </p>
            {resetUrl && (
              <div className="rounded-xl border border-border bg-surface p-4 space-y-2">
                <p className="text-xs text-muted-2">
                  Your reset link (email delivery not yet configured):
                </p>
                <Link
                  href={resetUrl}
                  className="block text-xs break-all text-amber hover:underline"
                >
                  {resetUrl}
                </Link>
              </div>
            )}
          </div>
        ) : (
          <>
            <p className="mt-2 text-sm text-muted">
              Enter your email and we will generate a reset link.
            </p>
            <form onSubmit={submit} className="mt-8 space-y-4">
              <div>
                <label className="mb-1.5 block text-xs text-muted-2">Email</label>
                <input
                  type="email" required value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="you@example.com" className="input"
                />
              </div>
              {error && (
                <p className="rounded-lg border border-red-900/40 bg-red-950/30 px-3 py-2 text-xs text-red-300">
                  {error}
                </p>
              )}
              <button type="submit" disabled={loading} className="btn-primary w-full py-2.5">
                {loading ? "Checking..." : "Send reset link"}
              </button>
            </form>
          </>
        )}
      </div>
    </main>
  );
}
