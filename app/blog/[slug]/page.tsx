import { redirect } from "next/navigation";

export default async function OldBlogSlug({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  redirect(`/posts/${slug}`);
}
