"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useRouter } from "next/navigation";

type Cmd = {
  label: string;
  hint?: string;
  run: () => void;
  show?: boolean;
};

function isTyping(el: EventTarget | null) {
  const t = el as HTMLElement | null;
  if (!t) return false;
  const tag = t.tagName;
  return tag === "INPUT" || tag === "TEXTAREA" || t.isContentEditable;
}

export function CommandLayer() {
  const router = useRouter();
  const [palette, setPalette] = useState(false);
  const [help, setHelp]       = useState(false);
  const [owner, setOwner]     = useState(false);
  const [authed, setAuthed]   = useState(false);
  const [query, setQuery]     = useState("");
  const [active, setActive]   = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const gPressed = useRef(false);
  const gTimer   = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((d) => { setAuthed(!!d.user); setOwner(!!d.user?.isOwner); })
      .catch(() => {});
  }, []);

  const go = useCallback((path: string) => {
    setPalette(false); setHelp(false);
    router.push(path);
  }, [router]);

  const newPost = useCallback(() => {
    setPalette(false); setHelp(false);
    if (window.location.pathname === "/") {
      window.dispatchEvent(new CustomEvent("jaz:compose"));
    } else {
      try { sessionStorage.setItem("jaz:compose", "1"); } catch {}
      router.push("/");
    }
  }, [router]);

  const commands: Cmd[] = [
    { label: "New post",        hint: "n",   run: newPost, show: authed },
    { label: "Go to feed",      hint: "g h", run: () => go("/") },
    { label: "Go to work",      hint: "g w", run: () => go("/about") },
    { label: "The lab (bots)",  hint: "g l", run: () => go("/lab"), show: owner },
    { label: "Inbox",           hint: "g i", run: () => go("/messages"), show: owner },
    { label: "Import LinkedIn", run: () => go("/import"), show: owner },
    { label: "Contact",         hint: "g c", run: () => go("/contact") },
    { label: "Sign in",         run: () => go("/login"), show: !authed },
    { label: "Create account",  run: () => go("/signup"), show: !authed },
    { label: "Keyboard shortcuts", hint: "?", run: () => { setPalette(false); setHelp(true); } },
  ];

  const visible = commands.filter((c) => c.show !== false);
  const filtered = query
    ? visible.filter((c) => c.label.toLowerCase().includes(query.toLowerCase()))
    : visible;

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      // Command palette — works anywhere
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPalette((p) => !p); setHelp(false); setQuery(""); setActive(0);
        return;
      }
      if (e.key === "Escape") { setPalette(false); setHelp(false); return; }

      if (palette) {
        if (e.key === "ArrowDown") { e.preventDefault(); setActive((a) => Math.min(a + 1, filtered.length - 1)); }
        if (e.key === "ArrowUp")   { e.preventDefault(); setActive((a) => Math.max(a - 1, 0)); }
        if (e.key === "Enter")     { e.preventDefault(); filtered[active]?.run(); }
        return;
      }

      if (isTyping(e.target)) return;

      // "g" prefix nav
      if (gPressed.current) {
        gPressed.current = false;
        if (gTimer.current) clearTimeout(gTimer.current);
        if (e.key === "h") go("/");
        else if (e.key === "w") go("/about");
        else if (e.key === "c") go("/contact");
        else if (e.key === "i" && owner) go("/messages");
        else if (e.key === "l" && owner) go("/lab");
        return;
      }
      if (e.key === "g") {
        gPressed.current = true;
        gTimer.current = setTimeout(() => { gPressed.current = false; }, 800);
        return;
      }

      if (e.key === "n" && authed) { e.preventDefault(); newPost(); }
      if (e.key === "?")           { e.preventDefault(); setHelp((h) => !h); }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [palette, help, owner, authed, filtered, active, go, newPost]);

  useEffect(() => {
    if (palette) setTimeout(() => inputRef.current?.focus(), 20);
  }, [palette]);

  if (!palette && !help) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 px-4 pt-[18vh] backdrop-blur-sm anim-fade-in"
      onClick={() => { setPalette(false); setHelp(false); }}
    >
      <div
        className="w-full max-w-md overflow-hidden rounded-2xl border border-border-strong bg-surface shadow-2xl anim-slide-down"
        onClick={(e) => e.stopPropagation()}
      >
        {palette ? (
          <>
            <input
              ref={inputRef}
              value={query}
              onChange={(e) => { setQuery(e.target.value); setActive(0); }}
              placeholder="Type a command..."
              className="w-full border-b border-border bg-transparent px-4 py-3.5 text-sm outline-none placeholder:text-muted-2"
            />
            <ul className="max-h-72 overflow-y-auto py-1.5">
              {filtered.length === 0 && (
                <li className="px-4 py-3 text-sm text-muted-2">No commands</li>
              )}
              {filtered.map((c, i) => (
                <li key={c.label}>
                  <button
                    onMouseEnter={() => setActive(i)}
                    onClick={c.run}
                    className={`flex w-full items-center justify-between px-4 py-2.5 text-left text-sm transition-colors ${
                      i === active ? "bg-surface-2 text-text" : "text-muted"
                    }`}
                  >
                    {c.label}
                    {c.hint && (
                      <kbd className="rounded border border-border px-1.5 py-0.5 font-mono text-[10px] text-muted-2">
                        {c.hint}
                      </kbd>
                    )}
                  </button>
                </li>
              ))}
            </ul>
          </>
        ) : (
          <div className="p-5">
            <p className="text-sm font-medium text-text mb-4">Keyboard shortcuts</p>
            <ul className="space-y-2.5 text-sm">
              {[
                ["Command palette", "⌘ K"],
                ["New post", "n"],
                ["Go to feed", "g h"],
                ["Go to work", "g w"],
                ["Go to contact", "g c"],
                ...(owner ? [["Inbox", "g i"], ["The lab", "g l"]] : []),
                ["Submit post / comment", "⌘ ↵"],
                ["This menu", "?"],
              ].map(([label, key]) => (
                <li key={label} className="flex items-center justify-between">
                  <span className="text-muted">{label}</span>
                  <kbd className="rounded border border-border px-2 py-0.5 font-mono text-[11px] text-muted-2">{key}</kbd>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
