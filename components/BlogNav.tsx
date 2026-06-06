import Link from "next/link";
import type { SessionUser } from "@/lib/auth";
import { Avatar } from "@/components/Avatar";
import { LogoutButton } from "@/components/LogoutButton";
import { initialsOf } from "@/lib/format";

export function BlogNav({ user }: { user: SessionUser | null }) {
  return (
    <header className="sticky top-0 z-20 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-14 w-full max-w-2xl items-center justify-between px-5">
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="nav-link text-sm"
            title="Back to portfolio"
          >
            ← Jaz
          </Link>
          <Link href="/blog" className="text-sm font-medium text-foreground">
            The Blog
          </Link>
        </div>

        <div className="flex items-center gap-4 text-sm">
          {user ? (
            <>
              {user.isOwner && (
                <Link href="/messages" className="nav-link">
                  Inbox
                </Link>
              )}
              <Avatar
                src={user.avatarUrl}
                initials={initialsOf(user.displayName)}
                size={26}
              />
              <span className="hidden text-muted sm:inline">
                {user.displayName}
              </span>
              <LogoutButton />
            </>
          ) : (
            <>
              <Link href="/login" className="nav-link">
                Log in
              </Link>
              <Link
                href="/signup"
                className="rounded-full bg-foreground px-3.5 py-1.5 text-xs font-medium text-background transition-opacity hover:opacity-90"
              >
                Sign up
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
