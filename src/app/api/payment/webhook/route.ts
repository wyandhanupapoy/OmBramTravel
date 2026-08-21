import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { core } from "@/lib/midtrans";
import crypto from "crypto";

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
      await db.booking.update({
        where: { orderCode: orderId },
        data: { 
          paymentStatus: "paid", 
          paymentMethod: body.payment_type,
          paidAt: new Date(),
          status: "confirmed"
        }
      });
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
