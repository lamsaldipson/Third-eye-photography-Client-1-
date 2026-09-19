import { NextRequest, NextResponse } from "next/server";
import { updateBookingStatus } from "@/lib/data";
import { ADMIN_COOKIE_NAME, expectedSessionToken } from "@/lib/auth";
import type { Booking } from "@/types";

const VALID_STATUSES: Booking["status"][] = [
  "new",
  "contacted",
  "confirmed",
  "declined",
];

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = req.cookies.get(ADMIN_COOKIE_NAME)?.value;
  if (!session || session !== (await expectedSessionToken())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const status = body?.status;

  if (!VALID_STATUSES.includes(status)) {
    return NextResponse.json({ error: "Invalid status." }, { status: 400 });
  }

  const { id } = await params;

  await updateBookingStatus(id, status);
  return NextResponse.json({ ok: true });
}
