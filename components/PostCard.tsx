import Link from "next/link";
import { ImageGrid } from "@/components/ImageGrid";
import { timeAgo, initialsOf } from "@/lib/format";
import { Avatar } from "@/components/Avatar";

export type FeedPost = {
  id: string;
  slug: string;
  title: string;
  body: string;
  images: string[];
  kind?: string;
  externalUrl?: string | null;
  createdAt: Date | string;
  author: {
    displayName: string;
    avatarUrl: string | null;
    isOwner: boolean;
    isBot?: boolean;
    botTitle?: string | null;
  };
  _count: { comments: number };
};

export function PostCard({ post }: { post: FeedPost }) {
  const excerpt =
    post.body.length > 280 ? post.body.slice(0, 280).trimEnd() + "..." : post.body;

  return (
    <article className="border-b border-border py-7 last:border-0">
      {/* Byline */}
      <div className="flex items-center gap-2 mb-3">
        <Avatar src={post.author.avatarUrl} initials={initialsOf(post.author.displayName)} size={26} />
        <span className="text-xs font-medium text-muted">{post.author.displayName}</span>

        {post.author.isOwner && (
          <span className="badge-orange">author</span>
        )}
        {post.author.isBot && post.author.botTitle && (
          <span className="badge">{post.author.botTitle}</span>
        )}
        {post.kind === "linkedin" && (
          <span className="badge">LinkedIn</span>
        )}
        <span className="ml-auto text-xs" style={{ color: "var(--muted-2)" }}>
          {timeAgo(post.createdAt)}
        </span>
      </div>

      {/* Content */}
      <Link href={`/posts/${post.slug}`} className="group block">
        <h2 className="serif text-xl font-normal leading-snug text-text transition-colors group-hover:text-orange">
          {post.title}
        </h2>
        {excerpt && (
          <p className="mt-2 text-[14px] leading-relaxed line-clamp-3" style={{ color: "var(--muted)" }}>
            {excerpt}
          </p>
        )}
      </Link>

      {post.images.length > 0 && (
        <Link href={`/posts/${post.slug}`} className="mt-3 block">
          <ImageGrid images={post.images} />
        </Link>
      )}

      {/* Footer */}
      <div className="mt-3 flex items-center gap-4 text-xs" style={{ color: "var(--muted-2)" }}>
        <Link href={`/posts/${post.slug}#comments`} className="hover:text-orange transition-colors">
          {post._count.comments} {post._count.comments === 1 ? "comment" : "comments"}
        </Link>
        <Link href={`/posts/${post.slug}`} className="hover:text-orange transition-colors">
          Read
        </Link>
      </div>
    </article>
  );
}
