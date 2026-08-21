import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const bookingId = url.searchParams.get("bookingId");

    if (!bookingId) {
      return NextResponse.json({ error: "Booking ID required" }, { status: 400 });
    }

    const latestTrack = await db.tracking.findFirst({
      where: { bookingId },
      orderBy: { timestamp: "desc" }
    });

    if (latestTrack) {
      return NextResponse.json({
        lat: latestTrack.lat,
        lng: latestTrack.lng,
        timestamp: latestTrack.timestamp
      });
    }

    return NextResponse.json(null);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch track" }, { status: 500 });
  }
}
