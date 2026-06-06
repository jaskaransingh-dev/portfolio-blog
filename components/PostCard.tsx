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
  createdAt: Date | string;
  author: { displayName: string; avatarUrl: string | null; isOwner: boolean };
  _count: { comments: number };
};

export function PostCard({ post }: { post: FeedPost }) {
  const excerpt =
    post.body.length > 300
      ? post.body.slice(0, 300).trimEnd() + "..."
      : post.body;

  return (
    <article className="border-b border-border py-8 last:border-0">
      {/* Author row */}
      <div className="flex items-center gap-2.5 mb-4">
        <Avatar
          src={post.author.avatarUrl}
          initials={initialsOf(post.author.displayName)}
          size={28}
        />
        <span className="text-sm text-muted">{post.author.displayName}</span>
        {post.author.isOwner && (
          <span className="rounded-full border border-border px-1.5 py-px text-[10px] text-muted-2">
            author
          </span>
        )}
        <span className="text-muted-2 text-xs ml-auto">{timeAgo(post.createdAt)}</span>
      </div>

      {/* Title + body */}
      <Link href={`/posts/${post.slug}`} className="group block">
        <h2 className="serif text-2xl font-normal leading-snug text-text group-hover:text-amber transition-colors">
          {post.title}
        </h2>
        {excerpt && (
          <p className="mt-2.5 text-[15px] leading-relaxed text-muted whitespace-pre-wrap line-clamp-4">
            {excerpt}
          </p>
        )}
      </Link>

      {/* Images */}
      {post.images.length > 0 && (
        <Link href={`/posts/${post.slug}`} className="mt-4 block">
          <ImageGrid images={post.images} />
        </Link>
      )}

      {/* Footer */}
      <div className="mt-4 flex items-center gap-5 text-xs text-muted-2">
        <Link
          href={`/posts/${post.slug}#comments`}
          className="transition-colors hover:text-text"
        >
          {post._count.comments} {post._count.comments === 1 ? "comment" : "comments"}
        </Link>
        <Link
          href={`/posts/${post.slug}`}
          className="transition-colors hover:text-text"
        >
          Read
        </Link>
      </div>
    </article>
  );
}
