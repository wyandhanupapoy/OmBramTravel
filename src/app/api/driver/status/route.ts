import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const { bookingId, status } = await req.json();
    const driverId = (await cookies()).get("driver_session")?.value;

    if (!driverId || !["en-route", "arrived", "touring", "completed"].includes(status)) {
      return NextResponse.json({ error: "Invalid driver status request" }, { status: 400 });
    }

    const booking = await db.booking.findFirst({
      where: { id: bookingId, driverId }
    });

    if (!booking) {
      return NextResponse.json({ error: "Booking not assigned to this driver" }, { status: 404 });
    }

    // Logic Timestamp
    const updateData: any = { status };
    if (status === "en-route") updateData.departedAt = new Date();
    if (status === "arrived") updateData.arrivedAt = new Date();
    if (status === "touring") updateData.startedAt = new Date();
    if (status === "completed") updateData.completedAt = new Date();

    const updatedBooking = await db.booking.update({
      where: { id: bookingId },
      data: updateData,
      include: { driver: true, tour: true }
    });

    // Kirim Notifikasi WhatsApp
    if (status === "en-route" || status === "arrived") {
      const { sendWhatsAppMessage } = await import("@/lib/whatsapp");
      const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://ombramtravel.com";
      const trackLink = `${baseUrl}/${updatedBooking.customerLocale}/track/${updatedBooking.orderCode}`;
      
      let msg = "";
      if (status === "en-route") {
        msg = `Halo ${updatedBooking.customerName}!\n\nDriver Anda, *${updatedBooking.driver?.name}*, sedang dalam perjalanan menuju titik penjemputan.\n\nLacak perjalanan secara real-time di sini:\n${trackLink}\n\nTerima kasih,\n*Om Bram Travel*`;
      } else if (status === "arrived") {
        msg = `Halo ${updatedBooking.customerName}!\n\nDriver Anda telah *tiba di titik penjemputan*. Silakan bersiap-siap untuk memulai perjalanan wisata Anda.\n\nJika butuh bantuan, hubungi driver di: ${updatedBooking.driver?.phone}\n\nSelamat menikmati *${updatedBooking.tour.titleId}*!`;
      }

      // Jalankan secara asynchronous tanpa memblokir response
      sendWhatsAppMessage(updatedBooking.customerPhone, msg).catch(console.error);
    }

    return NextResponse.json({ success: true, status });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update status" }, { status: 500 });
  }
}
