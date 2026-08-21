"use server";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createDriver(formData: FormData) {
  const name = formData.get("name") as string;
  const phone = formData.get("phone") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const licenseNo = formData.get("licenseNo") as string;
  
  const vehicleName = formData.get("vehicleName") as string;
  const vehiclePlate = formData.get("vehiclePlate") as string;
  const vehicleType = formData.get("vehicleType") as string;
  const vehicleCapacity = parseInt(formData.get("vehicleCapacity") as string);

  // Buat Vehicle & Driver secara berurutan dalam satu transaksi
  await db.$transaction(async (tx) => {
    // 1. Tambahkan Mobil
    const vehicle = await tx.vehicle.create({
      data: {
        name: vehicleName,
        plate: vehiclePlate,
        type: vehicleType,
        capacity: vehicleCapacity,
      }
    });

    // 2. Tambahkan Driver dan kaitkan dengan mobil tersebut
    await tx.driver.create({
      data: {
        name,
        phone,
        email,
        password, // Idealnya di-hash menggunakan bcrypt untuk versi production final
        licenseNo,
        vehicleId: vehicle.id
      }
    });
  });

  revalidatePath("/admin/drivers");
  redirect("/admin/drivers");
}

export async function updateDriver(formData: FormData) {
  const driverId = formData.get("driverId") as string;
  const vehicleId = formData.get("vehicleId") as string;

  await db.$transaction([
    db.vehicle.update({
      where: { id: vehicleId },
      data: {
        name: formData.get("vehicleName") as string,
        plate: formData.get("vehiclePlate") as string,
        type: formData.get("vehicleType") as string,
        capacity: Number(formData.get("vehicleCapacity"))
      }
    }),
    db.driver.update({
      where: { id: driverId },
      data: {
        name: formData.get("name") as string,
        phone: formData.get("phone") as string,
        licenseNo: formData.get("licenseNo") as string,
        email: formData.get("email") as string,
        ...(formData.get("password") ? { password: formData.get("password") as string } : {})
      }
    })
  ]);

  revalidatePath("/admin/drivers");
  redirect("/admin/drivers");
}
