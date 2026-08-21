import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import crypto from "crypto";
import { sendEmailReceipt, sendWhatsAppReceipt, sendAdminWhatsApp } from "@/lib/notifications";
import { formatIDR } from "@/lib/utils";

const paxLabels: Record<string, [string, string]> = {
  id: ["Dewasa", "Anak"], en: ["Adults", "Children"], zh: ["成人", "儿童"], ms: ["Dewasa", "Kanak-kanak"],
  th: ["ผู้ใหญ่", "เด็ก"], ta: ["பெரியவர்கள்", "குழந்தைகள்"], ja: ["大人", "子供"], ko: ["성인", "어린이"], ar: ["بالغون", "أطفال"]
};

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Verify signature key to ensure request is from Midtrans
    const serverKey = process.env.MIDTRANS_SERVER_KEY || "";
    const hash = crypto
      .createHash("sha512")
      .update(`${body.order_id}${body.status_code}${body.gross_amount}${serverKey}`)
      .digest("hex");

    if (hash !== body.signature_key) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 403 });
    }

    const transactionStatus = body.transaction_status;
    const fraudStatus = body.fraud_status;
    const orderId = body.order_id;

    let paymentStatus = "pending";

    if (transactionStatus == "capture") {
      if (fraudStatus == "accept") paymentStatus = "paid";
    } else if (transactionStatus == "settlement") {
      paymentStatus = "paid";
    } else if (transactionStatus == "cancel" || transactionStatus == "deny" || transactionStatus == "expire") {
      paymentStatus = "expired";
    }

    if (paymentStatus === "paid") {
      const booking = await db.booking.update({
        where: { orderCode: orderId },
        data: { 
          paymentStatus: "paid", 
          paymentMethod: body.payment_type,
          paidAt: new Date(),
          status: "confirmed"
        },
        include: { tour: true }
      });

      const [adultLabel, childLabel] = paxLabels[booking.customerLocale] || paxLabels.id;
      const notifData = {
        orderCode: booking.orderCode,
        customerName: booking.customerName,
        customerEmail: booking.customerEmail,
        customerPhone: booking.customerPhone,
        tourName: booking.customerLocale === "en" ? booking.tour.titleEn : booking.customerLocale === "zh" ? (booking.tour.titleZh || booking.tour.titleEn) : booking.tour.titleId,
        date: new Intl.DateTimeFormat(booking.customerLocale, { weekday: "long", year: "numeric", month: "long", day: "numeric" }).format(booking.date),
        paxInfo: `${booking.pax} ${adultLabel}, ${booking.children} ${childLabel}`,
        totalIDR: formatIDR(booking.totalIDR),
        locale: booking.customerLocale,
        customerCountry: booking.customerCountry
      };

      // WAJIB menggunakan await agar Vercel tidak mematikan fungsi sebelum email terkirim
      try {
        await Promise.all([
          sendEmailReceipt(notifData),
          sendWhatsAppReceipt(notifData),
          sendAdminWhatsApp(notifData)
        ]);
        console.log("Notifikasi berhasil dikirim!");
      } catch (err) {
        console.error("Notification error:", err);
      }

    } else if (paymentStatus === "expired") {
      await db.booking.update({
        where: { orderCode: orderId },
        data: { paymentStatus: "expired", status: "cancelled" }
      });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Webhook error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
