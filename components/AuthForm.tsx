"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { generatePassphrase, passwordHint } from "@/lib/passphrase";

export function AuthForm({
  mode,
  redirectTo = "/",
}: {
  mode: "signup" | "login";
  redirectTo?: string;
}) {
  const router = useRouter();
  const isSignup = mode === "signup";

  const [email,       setEmail]       = useState("");
  const [displayName, setDisplayName] = useState("");
  const [password,    setPassword]    = useState("");
  const [show,        setShow]        = useState(false);
  const [error,       setError]       = useState<string | null>(null);
  const [loading,     setLoading]     = useState(false);

  const hint = isSignup ? passwordHint(password) : "";

  async function onSubmit(ev: React.FormEvent) {
    ev.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res  = await fetch(`/api/auth/${mode}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(isSignup ? { email, password, displayName } : { email, password }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error ?? "Something went wrong."); setLoading(false); return; }
      router.push(redirectTo);
      router.refresh();
    } catch {
      setError("Network error — try again.");
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">

      <div>
        <label className="mb-1.5 block text-xs text-muted-2">Email</label>
        <input
          type="email" required autoComplete="email"
          value={email} onChange={e => setEmail(e.target.value)}
          placeholder="you@example.com" className="input"
        />
      </div>

      {isSignup && (
        <div>
          <label className="mb-1.5 block text-xs text-muted-2">
            Display name <span className="text-muted-2">(optional)</span>
          </label>
          <input
            type="text"
            value={displayName} onChange={e => setDisplayName(e.target.value)}
            placeholder="What should people call you?" className="input"
          />
        </div>
      )}

      <div>
        <div className="mb-1.5 flex items-center justify-between">
          <label className="text-xs text-muted-2">Password</label>
          {!isSignup && (
            <Link href="/forgot-password" className="text-xs text-muted hover:text-text transition-colors">
              Forgot password?
            </Link>
          )}
        </div>
        <div className="relative">
          <input
            type={show ? "text" : "password"} required
            autoComplete={isSignup ? "new-password" : "current-password"}
            value={password} onChange={e => setPassword(e.target.value)}
            placeholder="••••••••" className="input pr-16"
          />
          <button
            type="button" onClick={() => setShow(s => !s)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-2 hover:text-text transition-colors"
          >
            {show ? "hide" : "show"}
          </button>
        </div>

        {isSignup && (
          <button
            type="button"
            onClick={() => { setPassword(generatePassphrase()); setShow(true); }}
            className="mt-2 text-xs text-muted hover:text-text transition-colors"
          >
            Generate a memorable password
          </button>
        )}
        {hint && <p className="mt-1.5 text-xs text-muted-2">{hint}</p>}
      </div>

      {error && (
        <p className="rounded-lg border border-red-900/40 bg-red-950/30 px-3 py-2 text-xs text-red-300">
          {error}
        </p>
      )}

      <button type="submit" disabled={loading} className="btn-primary w-full py-2.5">
        {loading ? "One moment..." : isSignup ? "Create account" : "Sign in"}
      </button>

      <p className="text-center text-xs text-muted-2">
        {isSignup ? (
          <>Already have an account?{" "}
            <Link href="/login" className="text-muted hover:text-text transition-colors">Sign in</Link>
          </>
        ) : (
          <>New here?{" "}
            <Link href="/signup" className="text-muted hover:text-text transition-colors">Create an account</Link>
          </>
        )}
      </p>
    </form>
  );
}
