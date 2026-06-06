"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { generatePassphrase } from "@/lib/passphrase";

function ResetForm() {
  const router      = useRouter();
  const searchParams = useSearchParams();
  const token       = searchParams.get("token") ?? "";

  const [password, setPassword] = useState("");
  const [show,     setShow]     = useState(false);
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState<string | null>(null);

  if (!token) {
    return (
      <p className="text-sm text-muted">
        Invalid reset link.{" "}
        <Link href="/forgot-password" className="link-amber">Request a new one.</Link>
      </p>
    );
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true); setError(null);
    const res  = await fetch("/api/auth/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, password }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) { setError(data.error); return; }
    router.push("/");
    router.refresh();
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <div>
        <div className="mb-1.5 flex items-center justify-between">
          <label className="text-xs text-muted-2">New password</label>
          <button
            type="button"
            onClick={() => { setPassword(generatePassphrase()); setShow(true); }}
            className="text-xs text-muted hover:text-text transition-colors"
          >
            Generate one
          </button>
        </div>
        <div className="relative">
          <input
            type={show ? "text" : "password"} required
            value={password} onChange={e => setPassword(e.target.value)}
            placeholder="New password" className="input pr-16"
          />
          <button
            type="button" onClick={() => setShow(s => !s)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-2 hover:text-text transition-colors"
          >
            {show ? "hide" : "show"}
          </button>
        </div>
      </div>

      {error && (
        <p className="rounded-lg border border-red-900/40 bg-red-950/30 px-3 py-2 text-xs text-red-300">
          {error}
        </p>
      )}

      <button type="submit" disabled={loading} className="btn-primary w-full py-2.5">
        {loading ? "Resetting..." : "Set new password"}
      </button>
    </form>
  );
}

export default function ResetPasswordPage() {
  return (
    <main className="flex flex-1 items-center justify-center px-5 py-16">
      <div className="w-full max-w-sm">
        <Link href="/login" className="text-xs text-muted-2 hover:text-text transition-colors">
          Back to sign in
        </Link>
        <h1 className="serif mt-6 text-2xl font-normal">Set a new password</h1>
        <p className="mt-2 text-sm text-muted">
          Choose something memorable. You will be signed in automatically.
        </p>
        <div className="mt-8">
          <Suspense fallback={<p className="text-sm text-muted">Loading...</p>}>
            <ResetForm />
          </Suspense>
        </div>
      </div>
    </main>
  );
}
