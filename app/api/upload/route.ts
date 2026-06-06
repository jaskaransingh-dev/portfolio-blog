import { NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { getCurrentUser } from "@/lib/auth";
import { customAlphabet } from "nanoid";

const id = customAlphabet("abcdefghijklmnopqrstuvwxyz0123456789", 10);
const MAX_BYTES = 8 * 1024 * 1024; // 8 MB

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Log in to upload." }, { status: 401 });
  }

  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return NextResponse.json(
      { error: "Image storage isn't configured yet." },
      { status: 503 },
    );
  }

  const form = await req.formData();
  const file = form.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file provided." }, { status: 400 });
  }
  if (!file.type.startsWith("image/")) {
    return NextResponse.json({ error: "Images only." }, { status: 400 });
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json(
      { error: "Image is too large (max 8 MB)." },
      { status: 400 },
    );
  }

  const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const blob = await put(`posts/${id()}.${ext}`, file, {
    access: "public",
    contentType: file.type,
  });

  return NextResponse.json({ url: blob.url });
}
