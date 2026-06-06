import Link from "next/link";
import { Avatar } from "@/components/Avatar";
import {
  profile,
  currently,
  previously,
  projects,
  skills,
} from "@/lib/profile";

// Render "{Label|https://url}" segments inside a paragraph as inline links.
function renderProse(text: string) {
  const parts = text.split(/(\{[^}]+\})/g);
  return parts.map((part, i) => {
    const m = part.match(/^\{([^|]+)\|([^}]+)\}$/);
    if (m) {
      return (
        <a
          key={i}
          href={m[2]}
          target="_blank"
          rel="noreferrer"
          className="prose-link"
        >
          {m[1]}
        </a>
      );
    }
    return <span key={i}>{part}</span>;
  });
}

// Render a "Currently" item that contains a single "{link}" placeholder.
function renderCurrently(item: (typeof currently)[number], i: number) {
  const [before, after] = item.text.split("{link}");
  return (
    <li key={i} className="flex gap-3 text-[15px] leading-relaxed text-muted">
      <span className="mt-[9px] h-1 w-1 shrink-0 rounded-full bg-muted-2" />
      <span>
        {before}
        {item.href && item.linkText && (
          <a
            href={item.href}
            target={item.href.startsWith("#") ? undefined : "_blank"}
            rel="noreferrer"
            className="prose-link"
          >
            {item.linkText}
          </a>
        )}
        {after}
      </span>
    </li>
  );
}

export default function Home() {
  return (
    <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-16 sm:py-24 md:px-10">
      <div className="grid grid-cols-1 gap-12 md:grid-cols-[200px_1fr] md:gap-16">
        {/* ── Left column ──────────────────────────────── */}
        <aside className="md:sticky md:top-24 md:self-start">
          <Avatar src={profile.photo} initials={profile.initials} size={88} />
          <div className="mt-6 space-y-5 text-sm">
            <div>
              <p className="text-foreground">Portfolio</p>
              <p className="text-muted">{profile.location}</p>
            </div>
            <nav className="flex flex-col gap-1.5">
              <Link href="/blog" className="nav-link w-fit">
                Blog
              </Link>
              <a
                href={profile.links.linkedin}
                target="_blank"
                rel="noreferrer"
                className="nav-link w-fit"
              >
                LinkedIn
              </a>
              <a
                href={profile.links.github}
                target="_blank"
                rel="noreferrer"
                className="nav-link w-fit"
              >
                GitHub
              </a>
              <a href={`mailto:${profile.email}`} className="nav-link w-fit">
                Contact
              </a>
            </nav>
          </div>
        </aside>

        {/* ── Right column ─────────────────────────────── */}
        <div className="animate-fade-up max-w-2xl">
          <header>
            <h1 className="text-2xl font-semibold tracking-tight">
              {profile.name}
            </h1>
            <p className="mt-1 text-muted">{profile.role}</p>
            <p className="mt-1 text-muted">
              Working on{" "}
              <a
                href={profile.workingOn.href}
                target="_blank"
                rel="noreferrer"
                className="prose-link"
              >
                {profile.workingOn.label}
              </a>{" "}
              <span className="text-muted-2">↗</span>
            </p>
          </header>

          {/* Currently */}
          <section className="mt-14">
            <h2 className="text-[15px] text-foreground">Currently</h2>
            <ul className="mt-4 space-y-3">{currently.map(renderCurrently)}</ul>
          </section>

          {/* Previously */}
          <section className="mt-12">
            <h2 className="text-[15px] text-foreground">Previously</h2>
            <div className="mt-4 space-y-4">
              {previously.map((p, i) => (
                <p key={i} className="text-[15px] leading-relaxed text-muted">
                  {renderProse(p)}
                </p>
              ))}
            </div>
          </section>

          {/* Featured Projects */}
          <section id="projects" className="mt-14 scroll-mt-24">
            <h2 className="text-[15px] text-foreground">Featured Projects</h2>
            <ul className="mt-6 divide-y divide-border">
              {projects.map((p) => {
                const Tile = (
                  <div className="group grid grid-cols-[auto_1fr] gap-5 py-6 sm:grid-cols-[auto_1fr_140px]">
                    <span className="font-mono text-2xl text-muted-2 tabular-nums">
                      {p.num}
                    </span>
                    <div>
                      <h3 className="flex items-center gap-1.5 text-[15px] font-medium text-foreground">
                        {p.name}
                        {p.href && (
                          <span className="text-muted-2 transition-colors group-hover:text-muted">
                            ↗
                          </span>
                        )}
                        <span className="ml-auto font-mono text-xs text-muted-2 sm:hidden">
                          {p.year}
                        </span>
                      </h3>
                      <p className="mt-1.5 text-sm leading-relaxed text-muted">
                        {p.tagline}
                      </p>
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {p.stack.map((s) => (
                          <span
                            key={s}
                            className="rounded-full border border-border bg-surface px-2 py-0.5 text-[11px] text-muted"
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="hidden sm:block">
                      <div
                        className="h-20 w-full rounded-md ring-1 ring-border-strong/60 transition-transform duration-300 group-hover:scale-[1.02]"
                        style={{ background: p.gradient }}
                      />
                      <p className="mt-1.5 text-right font-mono text-xs text-muted-2">
                        {p.year}
                      </p>
                    </div>
                  </div>
                );
                return (
                  <li key={p.num}>
                    {p.href ? (
                      <a href={p.href} target="_blank" rel="noreferrer">
                        {Tile}
                      </a>
                    ) : (
                      Tile
                    )}
                  </li>
                );
              })}
            </ul>
          </section>

          {/* Skills */}
          <section className="mt-12">
            <h2 className="text-[15px] text-foreground">Stack</h2>
            <dl className="mt-4 space-y-2.5">
              {skills.map((s) => (
                <div
                  key={s.group}
                  className="grid grid-cols-[110px_1fr] gap-3 text-sm"
                >
                  <dt className="text-muted-2">{s.group}</dt>
                  <dd className="text-muted">{s.items.join(", ")}</dd>
                </div>
              ))}
            </dl>
          </section>

          {/* Footer */}
          <footer className="mt-16 border-t border-border pt-6 text-sm text-muted-2">
            <p>
              Read my writing on the{" "}
              <Link href="/blog" className="prose-link">
                blog
              </Link>
              , or{" "}
              <Link href="/contact" className="prose-link">
                send me a message
              </Link>
              .
            </p>
            <p className="mt-2">
              © {new Date().getFullYear()} {profile.name}
            </p>
          </footer>
        </div>
      </div>
    </main>
  );
}
