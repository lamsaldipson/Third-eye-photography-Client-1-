import { NextRequest, NextResponse } from "next/server";
import { readPhoto } from "@/lib/uploads";

// Serves an uploaded gallery photo. On Cloudflare this streams the object
// out of the UPLOADS_BUCKET R2 bucket; locally it falls back to reading
// straight off disk. Gallery entries created while running on Cloudflare
// point here (`/api/uploads/<filename>`); entries created locally point
// at the statically-served `/uploads/<filename>` instead, so this route
// is only actually hit in the Cloudflare case, but works either way.
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ filename: string }> }
) {
  const { filename } = await params;
  const photo = await readPhoto(filename);

  if (!photo) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return new NextResponse(photo.body as BodyInit, {
    headers: {
      "Content-Type": photo.contentType,
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
