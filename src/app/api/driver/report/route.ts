import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("ombram_driver_token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { bookingId, reportDetails } = await req.json();

    if (!bookingId || !reportDetails) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Verify driver owns this booking
    const driver = await db.driver.findUnique({ where: { id: token } });
    const booking = await db.booking.findUnique({ where: { id: bookingId } });

    if (!driver || !booking || booking.driverId !== driver.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await db.booking.update({
      where: { id: bookingId },
      data: {
        isReported: true,
        reportDetails,
      }
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Report violation error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
