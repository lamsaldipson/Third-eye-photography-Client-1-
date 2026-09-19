import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { addBooking, getBookings } from "@/lib/data";
import { ADMIN_COOKIE_NAME, expectedSessionToken } from "@/lib/auth";
import type { Booking } from "@/types";

const REQUIRED_FIELDS = ["fullName", "email", "phone", "eventType", "eventDate"] as const;

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);

  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  for (const field of REQUIRED_FIELDS) {
    if (!body[field] || typeof body[field] !== "string") {
      return NextResponse.json(
        { error: `Please fill in the "${field}" field.` },
        { status: 400 }
      );
    }
  }

  const booking: Booking = {
    id: randomUUID(),
    fullName: body.fullName,
    email: body.email,
    phone: body.phone,
    eventType: body.eventType,
    eventDate: body.eventDate,
    venue: body.venue ?? "",
    guestCount: body.guestCount ?? "",
    package: body.package ?? "Not sure yet",
    message: body.message ?? "",
    status: "new",
    createdAt: new Date().toISOString(),
  };

  await addBooking(booking);

  return NextResponse.json({ ok: true }, { status: 201 });
}

export async function GET(req: NextRequest) {
  const session = req.cookies.get(ADMIN_COOKIE_NAME)?.value;
  if (!session || session !== (await expectedSessionToken())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const bookings = await getBookings();
  return NextResponse.json({ bookings });
}
