import { NextRequest, NextResponse } from "next/server";
import { deleteGalleryImage } from "@/lib/data";
import { deletePhoto } from "@/lib/uploads";
import { ADMIN_COOKIE_NAME, expectedSessionToken } from "@/lib/auth";

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = req.cookies.get(ADMIN_COOKIE_NAME)?.value;
  if (!session || session !== (await expectedSessionToken())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const removed = await deleteGalleryImage(id);

  if (removed) {
    await deletePhoto(removed.url);
  }

  return NextResponse.json({ ok: true });
}
