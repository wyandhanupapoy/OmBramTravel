import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const { bookingId, status } = await req.json();
    const driverId = (await cookies()).get("driver_session")?.value;

    if (!driverId || !["en-route", "arrived", "touring", "completed"].includes(status)) {
      return NextResponse.json({ error: "Invalid driver status request" }, { status: 400 });
    }

    const booking = await db.booking.findFirst({
      where: { id: bookingId, driverId }
    });

    if (!booking) {
      return NextResponse.json({ error: "Booking not assigned to this driver" }, { status: 404 });
    }

    // Logic Timestamp
    const updateData: any = { status };
    if (status === "en-route") updateData.departedAt = new Date();
    if (status === "arrived") updateData.arrivedAt = new Date();
    if (status === "touring") updateData.startedAt = new Date();
    if (status === "completed") updateData.completedAt = new Date();

    await db.booking.update({
      where: { id: bookingId },
      data: updateData
    });

    return NextResponse.json({ success: true, status });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update status" }, { status: 500 });
  }
}
