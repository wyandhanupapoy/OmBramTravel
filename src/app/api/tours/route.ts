import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const query = url.searchParams.get("q")?.trim() || "";
  const zone = url.searchParams.get("zone") || "all";
  const sort = url.searchParams.get("sort") || "recommended";
  const locale = url.searchParams.get("locale") || "id";
  const page = Math.max(Number(url.searchParams.get("page")) || 1, 1);
  const limit = Math.min(Math.max(Number(url.searchParams.get("limit")) || 12, 1), 24);
  const minPrice = Math.max(Number(url.searchParams.get("minPrice")) || 0, 0);
  const maxPrice = Number(url.searchParams.get("maxPrice")) || undefined;
  const duration = url.searchParams.get("duration") || "all";
  const pax = Math.max(Number(url.searchParams.get("pax")) || 0, 0);
  const vehicleType = url.searchParams.get("vehicleType") || "all";
  const vehicleCapacity = vehicleType !== "all" ? await db.vehicle.aggregate({ where: { type: vehicleType }, _max: { capacity: true } }) : null;
  const where = {
    isActive: true,
    basePrice: { gte: minPrice, ...(maxPrice ? { lte: maxPrice } : {}) },
    ...(duration !== "all" ? { duration } : {}),
    ...(pax ? { maxPax: { gte: pax } } : {}),
    ...(vehicleType !== "all" ? { maxPax: { lte: vehicleCapacity?._max.capacity || 0 } } : {}),
    ...(zone !== "all" ? { zone } : {}),
    ...(query ? {
      OR: [
        { titleId: { contains: query, mode: "insensitive" as const } },
        { titleEn: { contains: query, mode: "insensitive" as const } },
        { stops: { some: { nameId: { contains: query, mode: "insensitive" as const } } } }
      ]
    } : {})
  };
  const orderBy = sort === "cheap" ? { basePrice: "asc" as const } : sort === "expensive" ? { basePrice: "desc" as const } : { createdAt: "desc" as const };
  const [total, tours] = await Promise.all([
    db.tour.count({ where }),
    db.tour.findMany({
      where,
      orderBy,
      skip: (page - 1) * limit,
      take: limit,
      select: { slug: true, titleId: true, titleEn: true, titleZh: true, images: true, basePrice: true, duration: true, zone: true, maxPax: true, ratingAvg: true, ratingCount: true, stops: { orderBy: { order: "asc" }, select: { nameId: true } } }
    })
  ]);
  return NextResponse.json({ total, page, limit, tours: tours.map((tour) => ({ ...tour, title: locale === "en" ? tour.titleEn : locale === "zh" ? (tour.titleZh || tour.titleEn) : tour.titleId, images: JSON.parse(tour.images || "[]"), stops: tour.stops.map((stop) => stop.nameId) })) });
}
