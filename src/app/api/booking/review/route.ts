import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const { orderCode, rating, reviewText } = await req.json();

    if (!orderCode || rating === undefined) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const booking = await db.booking.findUnique({
      where: { orderCode },
      include: { driver: true }
    });

    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    if (booking.status !== "completed") {
      return NextResponse.json({ error: "Booking is not completed yet" }, { status: 400 });
    }

    // Update the booking with rating and review
    await db.booking.update({
      where: { orderCode },
      data: {
        rating,
        reviewText
      }
    });

    // Update driver's average rating
    if (booking.driverId) {
      const driverBookings = await db.booking.findMany({
        where: { driverId: booking.driverId, rating: { not: null } },
        select: { rating: true }
      });

      const totalRatings = driverBookings.length;
      const sumRatings = driverBookings.reduce((sum, b) => sum + (b.rating || 0), 0);
      const newAverage = totalRatings > 0 ? (sumRatings / totalRatings) : 5.0;

      await db.driver.update({
        where: { id: booking.driverId },
        data: { rating: newAverage }
      });
    }

    // Update tour's average rating
    const tourBookings = await db.booking.findMany({
      where: { tourId: booking.tourId, rating: { not: null } },
      select: { rating: true }
    });

    const totalTourRatings = tourBookings.length;
    const sumTourRatings = tourBookings.reduce((sum, b) => sum + (b.rating || 0), 0);
    const newTourAverage = totalTourRatings > 0 ? (sumTourRatings / totalTourRatings) : 5.0;

    await db.tour.update({
      where: { id: booking.tourId },
      data: { 
        ratingAvg: newTourAverage,
        ratingCount: totalTourRatings
      }
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Failed to submit review:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
