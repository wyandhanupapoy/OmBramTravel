import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const { code } = await req.json();

    if (!code) {
      return NextResponse.json({ error: "Missing promo code" }, { status: 400 });
    }

    const promo = await db.promo.findUnique({ where: { code: code.toUpperCase() } });

    if (!promo || !promo.isActive) {
      return NextResponse.json({ error: "Promo code invalid or inactive" }, { status: 400 });
    }

    if (promo.expiresAt && promo.expiresAt < new Date()) {
      return NextResponse.json({ error: "Promo code expired" }, { status: 400 });
    }

    if (promo.maxUsage && promo.usedCount >= promo.maxUsage) {
      return NextResponse.json({ error: "Promo code usage limit reached" }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      discount: promo.discount,
      type: promo.type
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
