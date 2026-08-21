import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();
    
    // Check database for driver
    const driver = await db.driver.findUnique({
      where: { email }
    });

    // In a real production app, compare hashed password using bcrypt.
    // Since we created it directly as plain text in the admin form, we compare plain text.
    if (driver && driver.password === password) {
      const cookieStore = await cookies();
      
      // Store driver ID in the cookie to identify them in the dashboard
      cookieStore.set("driver_session", driver.id, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 12 // 12 hours shift
      });

      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: "Email atau Password salah!" }, { status: 401 });
  } catch (error) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
