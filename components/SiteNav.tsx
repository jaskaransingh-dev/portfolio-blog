import Link from "next/link";
import type { SessionUser } from "@/lib/auth";
import { LogoutButton } from "@/components/LogoutButton";

export function SiteNav({ user }: { user: SessionUser | null }) {
  return (
    <header className="sticky top-0 z-20 border-b border-border bg-bg/85 backdrop-blur-md">
      <div className="mx-auto flex h-13 w-full max-w-2xl items-center justify-between px-5">
        <Link href="/" className="text-sm font-medium text-text tracking-tight">
          Jaz
        </Link>

        <nav className="flex items-center gap-5 text-sm">
          <Link href="/about" className="nav-link">
            Work
          </Link>
          <Link href="/contact" className="nav-link">
            Contact
          </Link>
          {user ? (
            <>
              {user.isOwner && (
                <>
                  <Link href="/lab" className="nav-link">Lab</Link>
                  <Link href="/messages" className="nav-link">Inbox</Link>
                </>
              )}
              <LogoutButton />
            </>
          ) : (
            <>
              <Link href="/login" className="nav-link">
                Sign in
              </Link>
              <Link href="/signup" className="btn-primary py-1.5 px-4 text-xs">
                Write
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
