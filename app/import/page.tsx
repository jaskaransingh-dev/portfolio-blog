"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function ImportPage() {
  const router = useRouter();
  const [url, setUrl]       = useState("");
  const [text, setText]     = useState("");
  const [imageUrl, setImg]  = useState("");
  const [busy, setBusy]     = useState(false);
  const [error, setError]   = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true); setError(null);
    const res  = await fetch("/api/posts/linkedin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url, text, imageUrl }),
    });
    const data = await res.json();
    setBusy(false);
    if (!res.ok) { setError(data.error ?? "Could not import."); return; }
    router.push(`/posts/${data.post.slug}`);
    router.refresh();
  }

  return (
    <main className="mx-auto w-full max-w-xl flex-1 px-5 py-12">
      <Link href="/" className="text-xs text-muted-2 hover:text-text transition-colors">Back</Link>
      <h1 className="serif mt-6 text-2xl font-normal">Import a LinkedIn post</h1>
      <p className="mt-2 text-sm text-muted">
        Paste a post you wrote on LinkedIn. It joins your feed with a link back to the original.
      </p>

      <form onSubmit={submit} className="mt-8 space-y-4">
        <div>
          <label className="mb-1.5 block text-xs text-muted-2">LinkedIn URL (optional)</label>
          <input value={url} onChange={e => setUrl(e.target.value)} placeholder="https://www.linkedin.com/posts/..." className="input" />
        </div>
        <div>
          <label className="mb-1.5 block text-xs text-muted-2">Post text</label>
          <textarea value={text} onChange={e => setText(e.target.value)} rows={8} placeholder="Paste the full text of your post. Markdown works." className="input resize-none" />
        </div>
        <div>
          <label className="mb-1.5 block text-xs text-muted-2">Image URL (optional)</label>
          <input value={imageUrl} onChange={e => setImg(e.target.value)} placeholder="https://..." className="input" />
        </div>
        {error && <p className="text-xs text-red-400">{error}</p>}
        <div className="flex justify-end">
          <button type="submit" disabled={busy || !text.trim()} className="btn-primary py-2 px-5 text-sm">
            {busy ? "Importing..." : "Add to feed"}
          </button>
        </div>
      </form>
    </main>
  );
}
