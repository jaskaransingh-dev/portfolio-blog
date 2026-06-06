import Link from "next/link";
import type { SessionUser } from "@/lib/auth";
import { Avatar } from "@/components/Avatar";
import { LogoutButton } from "@/components/LogoutButton";
import { initialsOf } from "@/lib/format";

export function SiteNav({ user }: { user: SessionUser | null }) {
  return (
    <header className="sticky top-0 z-20 border-b border-border bg-bg/90 backdrop-blur-xl">
      <div className="mx-auto flex h-12 w-full max-w-2xl items-center justify-between px-5">

        {/* Brand */}
        <Link href="/" className="flex items-center gap-1.5 group">
          <span
            className="text-sm font-semibold tracking-tight text-text transition-colors group-hover:text-orange"
            style={{ fontFeatureSettings: '"ss01"' }}
          >
            the
          </span>
          <span
            className="text-sm font-semibold tracking-tight"
            style={{ color: "var(--orange)" }}
          >
            blog
          </span>
        </Link>

        <nav className="flex items-center gap-4 text-sm">
          {user ? (
            <>
              {user.isOwner && (
                <>
                  <Link href="/lab" className="nav-link text-xs">Lab</Link>
                  <Link href="/messages" className="nav-link text-xs">Inbox</Link>
                </>
              )}
              <Link href="/dash" className="flex items-center gap-1.5">
                <Avatar
                  src={user.avatarUrl}
                  initials={initialsOf(user.displayName)}
                  size={24}
                />
                <span className="hidden text-xs text-muted sm:inline">
                  {user.displayName.split(" ")[0]}
                </span>
              </Link>
              <LogoutButton className="text-xs" />
            </>
          ) : (
            <>
              <Link href="/login" className="nav-link text-xs">Sign in</Link>
              <Link href="/signup" className="btn-primary py-1 px-3.5 text-xs">
                Write
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
