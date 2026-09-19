import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { deleteGalleryImage } from "@/lib/data";
import { ADMIN_COOKIE_NAME, expectedSessionToken } from "@/lib/auth";

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = req.cookies.get(ADMIN_COOKIE_NAME)?.value;
  if (!session || session !== (await expectedSessionToken())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const removed = await deleteGalleryImage(params.id);

  if (removed) {
    const filePath = path.join(process.cwd(), "public", removed.url.replace(/^\//, ""));
    await fs.unlink(filePath).catch(() => null);
  }

  return NextResponse.json({ ok: true });
}
