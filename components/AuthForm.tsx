"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  generatePassphrase,
  EMOJI_PALETTE,
  passwordStrengthHint,
} from "@/lib/passphrase";

export function AuthForm({
  mode,
  redirectTo = "/blog",
}: {
  mode: "signup" | "login";
  redirectTo?: string;
}) {
  const router = useRouter();
  const isSignup = mode === "signup";

  const [email, setEmail] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [emojiMode, setEmojiMode] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const hint = isSignup ? passwordStrengthHint(password) : "";

  function generate() {
    setEmojiMode(false);
    setShow(true);
    setPassword(generatePassphrase());
  }

  function tapEmoji(e: string) {
    setPassword((p) => p + e);
  }

  async function onSubmit(ev: React.FormEvent) {
    ev.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch(`/api/auth/${mode}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          isSignup ? { email, password, displayName } : { email, password },
        ),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Something went wrong.");
        setLoading(false);
        return;
      }
      router.push(redirectTo);
      router.refresh();
    } catch {
      setError("Network error — try again.");
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <div>
        <label className="mb-1.5 block text-xs text-muted-2">Email</label>
        <input
          type="email"
          required
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          className="w-full rounded-lg border border-border bg-surface px-3.5 py-2.5 text-sm outline-none transition-colors placeholder:text-muted-2 focus:border-border-strong"
        />
      </div>

      {isSignup && (
        <div>
          <label className="mb-1.5 block text-xs text-muted-2">
            Display name <span className="text-muted-2">(optional)</span>
          </label>
          <input
            type="text"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            placeholder="What should we call you?"
            className="w-full rounded-lg border border-border bg-surface px-3.5 py-2.5 text-sm outline-none transition-colors placeholder:text-muted-2 focus:border-border-strong"
          />
        </div>
      )}

      <div>
        <div className="mb-1.5 flex items-center justify-between">
          <label className="text-xs text-muted-2">
            {emojiMode ? "Emoji passcode" : "Password"}
          </label>
          <button
            type="button"
            onClick={() => {
              setEmojiMode((m) => !m);
              setPassword("");
              setError(null);
            }}
            className="text-xs text-muted transition-colors hover:text-foreground"
          >
            {emojiMode ? "Use a password instead" : "Use an emoji passcode 🔐"}
          </button>
        </div>

        {emojiMode ? (
          <div className="rounded-lg border border-border bg-surface p-3">
            <div className="flex min-h-11 items-center justify-between rounded-md bg-surface-2 px-3 py-2">
              <span className="text-xl tracking-[0.2em]">
                {password || (
                  <span className="text-sm tracking-normal text-muted-2">
                    Tap emoji to build your passcode
                  </span>
                )}
              </span>
              {password && (
                <div className="flex gap-2 text-xs text-muted-2">
                  <button
                    type="button"
                    onClick={() =>
                      setPassword((p) =>
                        [...p.match(/\p{Extended_Pictographic}/gu) ?? []]
                          .slice(0, -1)
                          .join(""),
                      )
                    }
                    className="transition-colors hover:text-foreground"
                  >
                    ⌫
                  </button>
                  <button
                    type="button"
                    onClick={() => setPassword("")}
                    className="transition-colors hover:text-foreground"
                  >
                    clear
                  </button>
                </div>
              )}
            </div>
            <div className="mt-3 grid grid-cols-8 gap-1.5">
              {EMOJI_PALETTE.map((e) => (
                <button
                  key={e}
                  type="button"
                  onClick={() => tapEmoji(e)}
                  className="rounded-md py-1.5 text-lg transition-colors hover:bg-surface-2"
                >
                  {e}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="relative">
            <input
              type={show ? "text" : "password"}
              required
              autoComplete={isSignup ? "new-password" : "current-password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full rounded-lg border border-border bg-surface px-3.5 py-2.5 pr-16 text-sm outline-none transition-colors placeholder:text-muted-2 focus:border-border-strong"
            />
            <button
              type="button"
              onClick={() => setShow((s) => !s)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-2 transition-colors hover:text-foreground"
            >
              {show ? "hide" : "show"}
            </button>
          </div>
        )}

        {isSignup && !emojiMode && (
          <button
            type="button"
            onClick={generate}
            className="mt-2 text-xs text-muted transition-colors hover:text-foreground"
          >
            🎲 Make me a memorable password
          </button>
        )}
        {isSignup && hint && (
          <p className="mt-2 text-xs text-muted-2">{hint}</p>
        )}
      </div>

      {error && (
        <p className="rounded-lg border border-red-900/40 bg-red-950/30 px-3 py-2 text-xs text-red-300">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-lg bg-foreground px-4 py-2.5 text-sm font-medium text-background transition-opacity hover:opacity-90 disabled:opacity-50"
      >
        {loading
          ? "One sec…"
          : isSignup
            ? "Create account & start writing"
            : "Log in"}
      </button>

      <p className="text-center text-xs text-muted-2">
        {isSignup ? (
          <>
            Already have an account?{" "}
            <Link href="/login" className="text-muted hover:text-foreground">
              Log in
            </Link>
          </>
        ) : (
          <>
            New here?{" "}
            <Link href="/signup" className="text-muted hover:text-foreground">
              Create an account
            </Link>
          </>
        )}
      </p>
    </form>
  );
}
