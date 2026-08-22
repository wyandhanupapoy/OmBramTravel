import { cookies } from "next/headers";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { DriverDashboardClient } from "@/components/driver/DriverDashboardClient";

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

  // Fallback: Lakukan auto-complete saat driver membuka halaman 
  // Karena Vercel Hobby plan membatasi Cron hanya bisa berjalan 1x sehari (tengah malam)
  const activeTours = await db.booking.findMany({
    where: { driverId: driver.id, status: "touring", tourStartedAt: { not: null } },
    include: { tour: true }
  });

  const now = Date.now();
  await Promise.all(
    activeTours
      .filter((booking) => {
        const duration = booking.tour.duration;
        const limitMs = (duration === "custom" ? 12 : duration === "half-day" ? 4 : 8) * 60 * 60 * 1000;
        return now - booking.tourStartedAt!.getTime() >= limitMs;
      })
      .map((booking) => db.booking.update({
        where: { id: booking.id },
        data: { status: "completed", completedAt: new Date() }
      }))
  );

  // Get active assignments, including tours currently in progress.
  const activeBookings = await db.booking.findMany({
    where: { 
      driverId: driver.id,
      status: { in: ["assigned", "en-route", "arrived", "touring"] }
    },
    include: { tour: true },
    orderBy: { date: "asc" }
  });

  return (
    <DriverDashboardClient driver={driver} bookings={activeBookings} />
  );
}
