import { cookies } from "next/headers";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { DriverDashboardClient } from "@/components/driver/DriverDashboardClient";

function getTourDurationMs(duration: string) {
  const hours = duration === "half-day" ? 4 : 8;
  return hours * 60 * 60 * 1000;
}

export default async function DriverDashboard() {
  const cookieStore = await cookies();
  const driverId = cookieStore.get("driver_session")?.value;

  if (!driverId) {
    redirect("/driver/login");
  }

  const driver = await db.driver.findUnique({
    where: { id: driverId },
    include: { vehicle: true }
  });

  if (!driver) {
    redirect("/driver/login");
  }

  const activeTours = await db.booking.findMany({
    where: {
      driverId: driver.id,
      status: "touring",
      tourStartedAt: { not: null }
    },
    include: { tour: true }
  });

  const now = Date.now();
  await Promise.all(
    activeTours
      .filter((booking) => now - booking.tourStartedAt!.getTime() >= getTourDurationMs(booking.tour.duration))
      .map((booking) => db.booking.update({
        where: { id: booking.id },
        data: { status: "completed" }
      }))
  );

  // Get active assignments, including tours currently in progress.
  const activeBookings = await db.booking.findMany({
    where: { 
      driverId: driver.id,
      status: { in: ["assigned", "en-route", "touring"] }
    },
    include: { tour: true },
    orderBy: { date: "asc" }
  });

  return (
    <DriverDashboardClient driver={driver} bookings={activeBookings} />
  );
}
