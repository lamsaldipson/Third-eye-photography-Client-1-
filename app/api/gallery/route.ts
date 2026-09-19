import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { promises as fs } from "fs";
import path from "path";
import { addGalleryImage, getGallery } from "@/lib/data";
import { ADMIN_COOKIE_NAME, expectedSessionToken } from "@/lib/auth";
import type { GalleryImage } from "@/types";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/avif"];
const MAX_BYTES = 12 * 1024 * 1024; // 12MB
const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");

export async function GET() {
  const images = await getGallery();
  return NextResponse.json({ images });
}

export async function POST(req: NextRequest) {
  const session = req.cookies.get(ADMIN_COOKIE_NAME)?.value;
  if (!session || session !== (await expectedSessionToken())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const form = await req.formData().catch(() => null);
  const file = form?.get("file");
  const caption = (form?.get("caption") as string) ?? "";
  const category = (form?.get("category") as string) ?? "Wedding";

  if (!file || !(file instanceof File)) {
    return NextResponse.json({ error: "No image file received." }, { status: 400 });
  }

  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json(
      { error: "Please upload a JPEG, PNG, WebP, or AVIF image." },
      { status: 400 }
    );
  }

  if (file.size > MAX_BYTES) {
    return NextResponse.json(
      { error: "Image is too large (12MB max)." },
      { status: 400 }
    );
  }

  await fs.mkdir(UPLOAD_DIR, { recursive: true });

  const ext = file.type.split("/")[1];
  const id = randomUUID();
  const filename = `${id}.${ext}`;
  const bytes = Buffer.from(await file.arrayBuffer());
  await fs.writeFile(path.join(UPLOAD_DIR, filename), bytes);

  const image: GalleryImage = {
    id,
    url: `/uploads/${filename}`,
    caption,
    category: (category as GalleryImage["category"]) || "Wedding",
    uploadedAt: new Date().toISOString(),
  };

  await addGalleryImage(image);

  return NextResponse.json({ image }, { status: 201 });
}
