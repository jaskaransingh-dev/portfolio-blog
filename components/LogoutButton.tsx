"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function LogoutButton({ className = "" }: { className?: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function logout() {
    setLoading(true);
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/blog");
    router.refresh();
  }

  return (
    <button
      onClick={logout}
      disabled={loading}
      className={`nav-link disabled:opacity-50 ${className}`}
    >
      {loading ? "…" : "Log out"}
    </button>
  );
}
