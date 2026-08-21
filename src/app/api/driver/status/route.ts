import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const { bookingId, status } = await req.json();
    const driverId = (await cookies()).get("driver_session")?.value;

    if (!driverId || !["en-route", "arrived", "completed"].includes(status)) {
      return NextResponse.json({ error: "Invalid driver status request" }, { status: 400 });
    }

    const booking = await db.booking.findFirst({
      where: { id: bookingId, driverId },
      include: { tour: true }
    });

    if (!booking) {
      return NextResponse.json({ error: "Booking not assigned to this driver" }, { status: 404 });
    }

    if (status === "en-route" && booking.status !== "assigned") {
      return NextResponse.json({ error: "Booking is not waiting for pickup" }, { status: 409 });
    }

    if (status === "arrived" && booking.status !== "en-route") {
      return NextResponse.json({ error: "Driver must be en route before arrival" }, { status: 409 });
    }

    if (status === "completed" && booking.status !== "touring") {
      return NextResponse.json({ error: "Tour is not active" }, { status: 409 });
    }

    await db.booking.update({
      where: { id: bookingId },
      data: status === "arrived"
        ? { status: "touring", tourStartedAt: new Date() }
        : { status }
    });

    return NextResponse.json({ success: true, status: status === "arrived" ? "touring" : status });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update status" }, { status: 500 });
  }
}
