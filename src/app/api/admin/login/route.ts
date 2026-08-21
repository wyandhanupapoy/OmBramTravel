import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  try {
    const { password } = await req.json();
    
    // In production, define ADMIN_PASSWORD in .env.local
    // Fallback to "ombram123" for testing
    const adminPass = process.env.ADMIN_PASSWORD || "ombram123";

    if (password === adminPass) {
      const cookieStore = await cookies();
      cookieStore.set("admin_session", "authenticated", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 7 // 7 days
      });

      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: "Password salah!" }, { status: 401 });
  } catch (error) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
