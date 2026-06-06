"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";

export function Composer({ displayName }: { displayName: string }) {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const taRef = useRef<HTMLTextAreaElement>(null);

  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [posting, setPosting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const firstName = displayName.split(/\s+/)[0];
  const canPost = (body.trim() || title.trim() || images.length) && !posting;

  function autoGrow() {
    const ta = taRef.current;
    if (!ta) return;
    ta.style.height = "auto";
    ta.style.height = Math.min(ta.scrollHeight, 480) + "px";
  }

  async function onPickFiles(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;
    setError(null);
    setUploading(true);
    try {
      for (const file of files.slice(0, 8 - images.length)) {
        const fd = new FormData();
        fd.append("file", file);
        const res = await fetch("/api/upload", { method: "POST", body: fd });
        const data = await res.json();
        if (!res.ok) {
          setError(data.error ?? "Upload failed.");
          break;
        }
        setImages((prev) => [...prev, data.url]);
      }
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  async function post() {
    setError(null);
    setPosting(true);
    try {
      const res = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, body, images }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Couldn't post.");
        setPosting(false);
        return;
      }
      setTitle("");
      setBody("");
      setImages([]);
      if (taRef.current) taRef.current.style.height = "auto";
      router.refresh();
    } catch {
      setError("Network error — try again.");
    } finally {
      setPosting(false);
    }
  }

  return (
    <div className="rounded-2xl border border-border bg-surface p-4">
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Title (optional)"
        className="w-full bg-transparent text-base font-medium outline-none placeholder:text-muted-2"
      />
      <textarea
        ref={taRef}
        value={body}
        onChange={(e) => {
          setBody(e.target.value);
          autoGrow();
        }}
        placeholder={`What's on your mind, ${firstName}?`}
        rows={2}
        className="mt-1 w-full resize-none bg-transparent text-[15px] leading-relaxed outline-none placeholder:text-muted-2"
      />

      {images.length > 0 && (
        <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-4">
          {images.map((url) => (
            <div
              key={url}
              className="group relative aspect-square overflow-hidden rounded-lg border border-border"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={url}
                alt=""
                className="h-full w-full object-cover"
              />
              <button
                onClick={() =>
                  setImages((prev) => prev.filter((u) => u !== url))
                }
                className="absolute right-1 top-1 rounded-full bg-black/70 px-1.5 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}

      {error && <p className="mt-2 text-xs text-red-400">{error}</p>}

      <div className="mt-3 flex items-center justify-between border-t border-border pt-3">
        <button
          onClick={() => fileRef.current?.click()}
          disabled={uploading || images.length >= 8}
          className="flex items-center gap-1.5 text-sm text-muted transition-colors hover:text-foreground disabled:opacity-40"
        >
          {uploading ? "Uploading…" : "📷 Add photos"}
        </button>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          multiple
          hidden
          onChange={onPickFiles}
        />
        <button
          onClick={post}
          disabled={!canPost}
          className="rounded-full bg-foreground px-5 py-1.5 text-sm font-medium text-background transition-opacity hover:opacity-90 disabled:opacity-40"
        >
          {posting ? "Posting…" : "Post"}
        </button>
      </div>
    </div>
  );
}
