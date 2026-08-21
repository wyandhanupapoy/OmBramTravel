import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { db } from "@/lib/db";
import { snap } from "@/lib/midtrans";
import { generateOrderCode } from "@/lib/utils";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { tourId, date, adults, children, luggage, pickupPoint, customerName, customerPhone, customerEmail, notes, locale } = body;

    const tour = await db.tour.findUnique({ where: { id: tourId } });
    if (!tour) return NextResponse.json({ error: "Tour not found" }, { status: 404 });

    // Server-side recalculation to prevent tampering
    const totalPax = adults + children;
    const extraPax = Math.max(0, totalPax - tour.maxPax);

    const adultTotal = adults * tour.basePrice;
    const childTotal = children * (tour.basePrice * ((100 - tour.childDisc) / 100));
    const extraTotal = extraPax * tour.extraPaxFee;
    const luggageTotal = luggage * tour.luggageFee;
    
    const subtotal = adultTotal + childTotal;
    const totalIDR = subtotal + extraTotal + luggageTotal;

    const orderCode = generateOrderCode();

    // Create DB Booking
    const booking = await db.booking.create({
      data: {
        orderCode,
        tourId,
        date: new Date(date),
        pax: adults,
        children,
        extraLuggage: luggage,
        pickupPoint,
        customerName,
        customerPhone,
        customerEmail,
        notes,
        subtotal,
        extraFees: extraTotal + luggageTotal,
        totalIDR,
        displayCurrency: "IDR", // Simplification: actual charge is always in IDR
      }
    });

    // Request Snap Token
    const parameter = {
      transaction_details: {
        order_id: orderCode,
        gross_amount: totalIDR,
      },
      customer_details: {
        first_name: customerName,
        email: customerEmail,
        phone: customerPhone,
      },
      item_details: [
        {
          id: tour.slug,
          price: tour.basePrice,
          quantity: adults,
          name: `Tour: ${tour.titleEn.substring(0, 30)} (Adult)`,
        }
      ]
    };

    if (children > 0) {
      parameter.item_details.push({
        id: `${tour.slug}-child`,
        price: tour.basePrice * ((100 - tour.childDisc) / 100),
        quantity: children,
        name: `Child Ticket`,
      });
    }
    
    if (extraTotal > 0) {
      parameter.item_details.push({
        id: `extra-pax`,
        price: tour.extraPaxFee,
        quantity: extraPax,
        name: `Extra Pax Charge`,
      });
    }

    if (luggage > 0) {
      parameter.item_details.push({
        id: `luggage`,
        price: tour.luggageFee,
        quantity: luggage,
        name: `Large Luggage Charge`,
      });
    }

    const snapResponse = await snap.createTransaction(parameter);

    // Set a cookie so the user's browser remembers their recent order
    const cookieStore = await cookies();
    cookieStore.set("ombram_recent_order", orderCode, {
      httpOnly: false, // False so client-side can read it if needed, or we read it server-side
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 30, // 30 days
      path: "/",
    });

    return NextResponse.json({
      token: snapResponse.token,
      orderCode: booking.orderCode,
    });

  } catch (error: any) {
    console.error("Payment creation error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
