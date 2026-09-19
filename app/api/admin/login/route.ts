import { NextRequest, NextResponse } from "next/server";
import { ADMIN_COOKIE_NAME, expectedSessionToken, isCorrectPassword } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const password = body?.password;

  if (!process.env.ADMIN_PASSWORD) {
    return NextResponse.json(
      {
        error:
          "No ADMIN_PASSWORD is set on the server. Add one to your .env.local file first.",
      },
      { status: 500 }
    );
  }

  if (typeof password !== "string" || !isCorrectPassword(password)) {
    return NextResponse.json({ error: "Incorrect password." }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set(ADMIN_COOKIE_NAME, await expectedSessionToken(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 8, // 8 hours
  });
  return res;
}
