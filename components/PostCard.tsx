import Link from "next/link";
import { Avatar } from "@/components/Avatar";
import { ImageGrid } from "@/components/ImageGrid";
import { timeAgo, initialsOf } from "@/lib/format";

export type FeedPost = {
  id: string;
  slug: string;
  title: string;
  body: string;
  images: string[];
  createdAt: Date | string;
  author: { displayName: string; avatarUrl: string | null; isOwner: boolean };
  _count: { comments: number };
};

export function PostCard({ post }: { post: FeedPost }) {
  const excerpt =
    post.body.length > 280 ? post.body.slice(0, 280).trimEnd() + "…" : post.body;

  return (
    <article className="rounded-2xl border border-border bg-surface p-5 transition-colors hover:border-border-strong">
      <div className="flex items-center gap-3">
        <Avatar
          src={post.author.avatarUrl}
          initials={initialsOf(post.author.displayName)}
          size={36}
        />
        <div className="min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="truncate text-sm font-medium text-foreground">
              {post.author.displayName}
            </span>
            {post.author.isOwner && (
              <span className="rounded-full bg-surface-2 px-1.5 py-0.5 text-[10px] font-medium text-muted">
                author
              </span>
            )}
          </div>
          <span className="text-xs text-muted-2">{timeAgo(post.createdAt)}</span>
        </div>
      </div>

      <Link href={`/blog/${post.slug}`} className="group mt-3 block">
        <h2 className="text-lg font-semibold leading-snug tracking-tight text-foreground group-hover:underline">
          {post.title}
        </h2>
        {excerpt && (
          <p className="mt-1.5 whitespace-pre-wrap text-[15px] leading-relaxed text-muted">
            {excerpt}
          </p>
        )}
      </Link>

      {post.images.length > 0 && (
        <Link href={`/blog/${post.slug}`} className="mt-3 block">
          <ImageGrid images={post.images} />
        </Link>
      )}

      <div className="mt-4 flex items-center gap-4 text-xs text-muted-2">
        <Link
          href={`/blog/${post.slug}#comments`}
          className="transition-colors hover:text-foreground"
        >
          💬 {post._count.comments}{" "}
          {post._count.comments === 1 ? "comment" : "comments"}
        </Link>
        <Link
          href={`/blog/${post.slug}`}
          className="transition-colors hover:text-foreground"
        >
          Read →
        </Link>
      </div>
    </article>
  );
}
