"use server";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function assignDriverToOrder(orderId: string, driverId: string) {
  await db.booking.update({
    where: { id: orderId },
    data: { 
      driverId, 
      status: "assigned",
      tourStartedAt: null
    }
  });
  
  revalidatePath("/admin/orders");
  revalidatePath("/admin/drivers");
}
