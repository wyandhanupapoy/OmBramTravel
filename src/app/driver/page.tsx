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

  // Get active assignments (assigned, en-route)
  const activeBookings = await db.booking.findMany({
    where: { 
      driverId: driver.id,
      status: { in: ["assigned", "en-route"] }
    },
    include: { tour: true },
    orderBy: { date: "asc" }
  });

  return (
    <DriverDashboardClient driver={driver} bookings={activeBookings} />
  );
}
