"use client";

import { useRef, useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export function Composer({ displayName }: { displayName: string }) {
  const router  = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const taRef   = useRef<HTMLTextAreaElement>(null);

  const [body,     setBody]     = useState("");
  const [images,   setImages]   = useState<string[]>([]);
  const [uploading,setUploading]= useState(false);
  const [posting,  setPosting]  = useState(false);
  const [error,    setError]    = useState<string | null>(null);
  const [open,     setOpen]     = useState(false);

  const firstName = displayName.split(/\s+/)[0];
  const canPost   = (body.trim() || images.length) && !posting;

  // Respond to the global "n" shortcut / cross-page compose intent.
  useEffect(() => {
    function openAndFocus() { setOpen(true); setTimeout(() => taRef.current?.focus(), 30); }
    window.addEventListener("jaz:compose", openAndFocus);
    try {
      if (sessionStorage.getItem("jaz:compose") === "1") {
        sessionStorage.removeItem("jaz:compose");
        openAndFocus();
      }
    } catch {}
    return () => window.removeEventListener("jaz:compose", openAndFocus);
  }, []);

  function grow() {
    const ta = taRef.current; if (!ta) return;
    ta.style.height = "auto";
    ta.style.height = Math.min(ta.scrollHeight, 520) + "px";
  }

  async function onFiles(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;
    setError(null); setUploading(true);
    for (const file of files.slice(0, 8 - images.length)) {
      const fd = new FormData(); fd.append("file", file);
      const res  = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) { setError(data.error ?? "Upload failed."); break; }
      setImages(p => [...p, data.url]);
    }
    setUploading(false);
    if (fileRef.current) fileRef.current.value = "";
  }

  async function post() {
    setError(null); setPosting(true);
    const res  = await fetch("/api/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ body, images }),
    });
    const data = await res.json();
    if (!res.ok) { setError(data.error ?? "Could not post."); setPosting(false); return; }
    setBody(""); setImages([]); setOpen(false);
    if (taRef.current) taRef.current.style.height = "auto";
    router.refresh();
    setPosting(false);
  }

  function onKeyDown(e: React.KeyboardEvent) {
    if ((e.metaKey || e.ctrlKey) && e.key === "Enter" && canPost) { e.preventDefault(); post(); }
  }

  if (!open) {
    return (
      <button
        onClick={() => { setOpen(true); setTimeout(() => taRef.current?.focus(), 30); }}
        className="flex w-full items-center justify-between rounded-xl border border-border bg-surface px-4 py-3 text-left text-sm transition-colors hover:border-orange-mid"
        style={{ color: "var(--muted-2)" }}
      >
        <span>What&apos;s on your mind, {firstName}?</span>
        <kbd className="rounded border border-border px-1.5 py-0.5 font-mono text-[10px]">n</kbd>
      </button>
    );
  }

  return (
    <div className="rounded-xl border bg-surface p-4 anim-slide-down" style={{ borderColor: "var(--orange-mid)", boxShadow: "0 0 0 3px var(--orange-dim)" }}>
      <textarea
        ref={taRef}
        value={body}
        onChange={e => { setBody(e.target.value); grow(); }}
        onKeyDown={onKeyDown}
        placeholder="Write something. Markdown works. The first line becomes the title."
        rows={3}
        className="w-full resize-none bg-transparent text-[15px] leading-relaxed outline-none placeholder:text-muted-2"
      />

      {images.length > 0 && (
        <div className="mt-3 grid grid-cols-4 gap-2">
          {images.map(url => (
            <div key={url} className="group relative aspect-square overflow-hidden rounded-lg border border-border">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={url} alt="" className="h-full w-full object-cover" />
              <button
                onClick={() => setImages(p => p.filter(u => u !== url))}
                className="absolute right-1 top-1 rounded-full bg-black/70 px-1.5 text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity"
              >x</button>
            </div>
          ))}
        </div>
      )}

      {error && <p className="mt-2 text-xs text-red-400">{error}</p>}

      <div className="mt-3 flex items-center justify-between border-t border-border pt-3">
        <div className="flex items-center gap-3">
          <button
            onClick={() => fileRef.current?.click()}
            disabled={uploading || images.length >= 8}
            className="text-xs text-muted hover:text-text transition-colors disabled:opacity-40"
          >{uploading ? "Uploading..." : "Add photo"}</button>
          <button
            onClick={() => { setOpen(false); setBody(""); setImages([]); }}
            className="text-xs text-muted-2 hover:text-muted transition-colors"
          >Cancel</button>
        </div>
        <input ref={fileRef} type="file" accept="image/*" multiple hidden onChange={onFiles} />
        <div className="flex items-center gap-2.5">
          <span className="hidden sm:inline text-[10px] text-muted-2 font-mono">⌘↵</span>
          <button onClick={post} disabled={!canPost} className="btn-primary py-1.5 px-4 text-xs">
            {posting ? "Posting..." : "Post"}
          </button>
        </div>
      </div>
    </div>
  );
}
