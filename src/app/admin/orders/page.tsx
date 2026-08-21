export const dynamic = "force-dynamic";
import { db } from "@/lib/db";
import { formatIDR } from "@/lib/utils";
import { AssignDriverDropdown } from "@/components/admin/AssignDriverDropdown";
import { AutoRefresh } from "@/components/admin/AutoRefresh";

import { AdminOrdersTable } from "@/components/admin/AdminOrdersTable";

export default async function AdminOrders() {
  const orders = await db.booking.findMany({
    orderBy: { createdAt: "desc" },
    include: { tour: true, driver: true }
  });

  const availableDrivers = await db.driver.findMany({
    select: { id: true, name: true },
    orderBy: { name: "asc" }
  });

  return (
    <div>
      <AutoRefresh intervalMs={5000} />
      <div className="flex justify-between items-end mb-8">
        <h1 className="font-display text-3xl text-pine-dark">Daftar Pesanan</h1>
      </div>

      <AdminOrdersTable orders={orders} drivers={availableDrivers} />
    </div>
  );
}

