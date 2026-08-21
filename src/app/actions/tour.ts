"use server";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createTour(formData: FormData) {
  // Extract simple fields
  const titleId = formData.get("titleId") as string;
  const titleEn = formData.get("titleEn") as string;
  const titleZh = formData.get("titleZh") as string;
  
  const descId = formData.get("descId") as string;
  const descEn = formData.get("descEn") as string;
  const descZh = formData.get("descZh") as string;
  
  const slug = formData.get("slug") as string;
  const zone = formData.get("zone") as string;
  const duration = formData.get("duration") as string;
  
  const basePrice = parseInt(formData.get("basePrice") as string);
  const maxPax = parseInt(formData.get("maxPax") as string);
  const extraPaxFee = parseInt(formData.get("extraPaxFee") as string);
  const luggageFee = parseInt(formData.get("luggageFee") as string);
  
  // Extract dynamic stops
  const stopsJson = formData.get("stopsData") as string;
  const stopsData = JSON.parse(stopsJson || "[]");

  // Default images for now to prevent breaking UI
  const images = JSON.stringify([
    "https://images.unsplash.com/photo-1549317661-bd32c8ce0afa?w=1200&h=800&fit=crop"
  ]);

  await db.tour.create({
    data: {
      slug,
      zone,
      duration,
      maxPax,
      basePrice,
      extraPaxFee,
      luggageFee,
      childDisc: 50,
      images,
      titleId,
      titleEn,
      titleZh,
      descId,
      descEn,
      descZh,
      stops: {
        create: stopsData.map((stop: any, index: number) => ({
          order: index + 1,
          nameId: stop.nameId,
          nameEn: stop.nameEn,
          nameZh: stop.nameZh,
          time: stop.time,
          duration: parseInt(stop.duration)
        }))
      }
    }
  });

  revalidatePath("/admin/tours");
  revalidatePath("/id/tours");
  revalidatePath("/en/tours");
  redirect("/admin/tours");
}
