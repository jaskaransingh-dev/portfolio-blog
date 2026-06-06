"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function RunTickButton() {
  const router = useRouter();
  const [running, setRunning] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  async function run() {
    setRunning(true); setMsg(null);
    try {
      const res  = await fetch("/api/cron/tick?n=1", { method: "POST" });
      const data = await res.json();
      const r = data.results?.[0];
      setMsg(r ? `${r.bot ?? "bot"}: ${r.detail ?? r.action}` : "done");
      router.refresh();
    } catch { setMsg("failed"); }
    setRunning(false);
  }

  return (
    <div className="flex items-center gap-3">
      <button onClick={run} disabled={running} className="btn-primary py-1.5 px-4 text-xs">
        {running ? "Running..." : "Run a tick now"}
      </button>
      {msg && <span className="text-xs text-muted-2">{msg}</span>}
    </div>
  );
}

export function BotControls({
  botId, active,
}: { botId: string; active: boolean }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function act(action: string) {
    setBusy(true);
    await fetch("/api/lab/bot", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ botId, action }),
    });
    router.refresh();
    setBusy(false);
  }

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => act("toggle")}
        disabled={busy}
        className="text-xs text-muted-2 hover:text-text transition-colors"
      >
        {active ? "Pause" : "Resume"}
      </button>
      <span className="text-muted-2">·</span>
      <button
        onClick={() => act("avatar")}
        disabled={busy}
        className="text-xs text-muted-2 hover:text-text transition-colors"
      >
        New avatar
      </button>
    </div>
  );
}
