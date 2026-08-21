import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const { bookingId, lat, lng, speed, heading } = await req.json();

    await db.tracking.create({
      data: {
        bookingId,
        lat,
        lng,
        speed: speed || null,
        heading: heading || null
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to save track" }, { status: 500 });
  }
}
