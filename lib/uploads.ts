import { promises as fs } from "fs";
import path from "path";

// Storage for the actual uploaded photo bytes, with the same two-backend
// pattern as lib/data.ts:
//
// - On Cloudflare, photos go to the `UPLOADS_BUCKET` R2 bucket and are
//   served back through /api/uploads/[filename] (see that route).
// - Everywhere else, photos are written straight to /public/uploads, the
//   same as before, and served by Next's normal static file handling.

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");

async function getBucket(): Promise<R2Bucket | null> {
  try {
    const { getCloudflareContext } = await import("@opennextjs/cloudflare");
    const ctx = getCloudflareContext();
    return (ctx?.env as CloudflareEnv | undefined)?.UPLOADS_BUCKET ?? null;
  } catch {
    return null;
  }
}

function contentTypeFor(filename: string): string {
  const ext = filename.split(".").pop()?.toLowerCase();
  switch (ext) {
    case "png":
      return "image/png";
    case "webp":
      return "image/webp";
    case "avif":
      return "image/avif";
    default:
      return "image/jpeg";
  }
}

/** Saves a photo's bytes and returns the URL the gallery should use for it. */
export async function savePhoto(
  filename: string,
  bytes: Buffer,
  contentType: string
): Promise<string> {
  const bucket = await getBucket();
  if (bucket) {
    await bucket.put(filename, bytes, { httpMetadata: { contentType } });
    return `/api/uploads/${filename}`;
  }

  await fs.mkdir(UPLOAD_DIR, { recursive: true });
  await fs.writeFile(path.join(UPLOAD_DIR, filename), bytes);
  return `/uploads/${filename}`;
}

/** Deletes a photo given the URL that was stored alongside its gallery entry. */
export async function deletePhoto(url: string): Promise<void> {
  const filename = url.split("/").pop();
  if (!filename) return;

  const bucket = await getBucket();
  if (bucket) {
    await bucket.delete(filename);
    return;
  }

  const filePath = path.join(UPLOAD_DIR, filename);
  await fs.unlink(filePath).catch(() => null);
}

/** Reads a photo back by filename, for the /api/uploads/[filename] route. */
export async function readPhoto(
  filename: string
): Promise<{ body: ReadableStream | ArrayBuffer; contentType: string } | null> {
  const bucket = await getBucket();
  if (bucket) {
    const obj = await bucket.get(filename);
    if (!obj) return null;
    return {
      body: obj.body as unknown as ReadableStream,
      contentType: obj.httpMetadata?.contentType ?? contentTypeFor(filename),
    };
  }

  try {
    const filePath = path.join(UPLOAD_DIR, filename);
    const bytes = await fs.readFile(filePath);
    return {
      body: bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength),
      contentType: contentTypeFor(filename),
    };
  } catch {
    return null;
  }
}
