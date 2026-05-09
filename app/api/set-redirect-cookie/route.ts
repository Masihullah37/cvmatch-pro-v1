import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { redirectTo } = await req.json();
  const response = NextResponse.json({ ok: true });
  if (redirectTo) {
    response.cookies.set("post_auth_redirect", redirectTo, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 10, // expires in 10 min
      path: "/",
    });
  }
  return response;
}