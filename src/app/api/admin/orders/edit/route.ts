import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("ombram_admin_token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { orderId, extraCharge, reportResolved } = await req.json();

    if (!orderId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const booking = await db.booking.findUnique({ where: { id: orderId } });
    if (!booking) return NextResponse.json({ error: "Booking not found" }, { status: 404 });

    const newExtraCharge = parseInt(extraCharge) || 0;
    // totalIDR is finalSubtotal + extraTotal + luggageTotal. We add the difference in extraCharge.
    // However, it's easier to just recalculate or just add the delta. 
    // Or we just update totalIDR directly: totalIDR = (totalIDR - oldExtraCharge) + newExtraCharge.
    const delta = newExtraCharge - booking.extraCharge;
    const newTotal = booking.totalIDR + delta;

    await db.booking.update({
      where: { id: orderId },
      data: {
        extraCharge: newExtraCharge,
        totalIDR: newTotal,
        isReported: reportResolved ? false : booking.isReported
      }
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Admin order edit error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
