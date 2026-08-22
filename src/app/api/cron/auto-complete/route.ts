import { NextResponse } from "next/server";
import { db } from "@/lib/db";

// Force Node.js runtime if preferred, or leave as edge. Vercel cron works with both.
export const dynamic = "force-dynamic";

function getTourDurationMs(duration: string) {
  // custom tour usually has "custom" duration, let's say 12 hours max.
  if (duration === "custom") return 12 * 60 * 60 * 1000;
  const hours = duration === "half-day" ? 4 : 8;
  return hours * 60 * 60 * 1000;
}

export async function GET(req: Request) {
  try {
    // Authenticate cron request (Vercel uses Authorization header with CRON_SECRET)
    const authHeader = req.headers.get("authorization");
    if (
      process.env.CRON_SECRET &&
      authHeader !== `Bearer ${process.env.CRON_SECRET}`
    ) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const activeTours = await db.booking.findMany({
      where: {
        status: "touring",
        tourStartedAt: { not: null }
      },
      include: { tour: true }
    });

    const now = Date.now();
    let completedCount = 0;

    await Promise.all(
      activeTours
        .filter((booking) => now - booking.tourStartedAt!.getTime() >= getTourDurationMs(booking.tour.duration))
        .map(async (booking) => {
          await db.booking.update({
            where: { id: booking.id },
            data: { 
              status: "completed", 
              completedAt: new Date() // Since we added completedAt earlier
            }
          });
          completedCount++;
        })
    );

    return NextResponse.json({ success: true, message: `Auto-completed ${completedCount} tours.` });
  } catch (error) {
    console.error("Cron auto-complete error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
