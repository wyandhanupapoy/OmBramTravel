import { PrismaClient } from "@prisma/client";
import destinationsData from "../src/lib/destinationsData.json";

const prisma = new PrismaClient();
const image = "https://images.unsplash.com/photo-1588668214407-6ea9a6d8c272?w=1200&h=800&fit=crop";

function slugify(value: string, index: number) {
  const slug = value.toLowerCase().normalize("NFKD").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  return `bandung-${slug || "destination"}-${index + 1}`;
}

function classify(name: string) {
  if (/Jalan|Street|Market|Mall|Shopping|Pasar|Culinary|Kuliner|Resto/i.test(name)) return "city";
  if (/Museum|Gedung|Monumen|Masjid|Alun|Taman|Kampung|Rumah|Merdeka|Sate|Saung/i.test(name)) return "city";
  if (/Park|Zoo|Water|World|Garden|Rabbit|Studio|Fairy|Champion|Balls/i.test(name)) return "family";
  return "nature";
}

function priceFor(index: number, zone: string) {
  if (zone === "city") return 450000 + (index % 5) * 50000;
  if (zone === "family") return 650000 + (index % 6) * 50000;
  return 750000 + (index % 7) * 50000;
}

async function main() {
  const destinations = Array.from(new Set(destinationsData.filter((name) => name.trim().length > 2)));

  for (let index = 0; index < destinations.length; index += 1) {
    const name = destinations[index];
    const next = destinations[(index + 1) % destinations.length];
    const nextNext = destinations[(index + 2) % destinations.length];
    const zone = classify(name);
    const slug = slugify(name, index);
    const basePrice = priceFor(index, zone);

    await prisma.tour.upsert({
      where: { slug },
      update: {
        titleId: `${name} & Bandung Raya`,
        titleEn: `${name} & Bandung Raya`,
        descId: `Rute wisata menuju ${name} dengan pilihan destinasi sekitar Bandung Raya.`,
        descEn: `A Bandung Raya route to ${name} with nearby destinations included.`,
        basePrice,
        zone,
        duration: zone === "city" ? "half-day" : "full-day",
        stops: {
          deleteMany: {},
          create: [name, next, nextNext].map((stopName, stopIndex) => ({
            order: stopIndex + 1,
            nameId: stopName,
            nameEn: stopName,
            nameZh: stopName,
            time: stopIndex === 0 ? "09:00" : stopIndex === 1 ? "12:00" : "15:00",
            duration: stopIndex === 0 ? 120 : 90
          }))
        }
      },
      create: {
        slug,
        zone,
        duration: zone === "city" ? "half-day" : "full-day",
        maxPax: 7,
        basePrice,
        extraPaxFee: 100000,
        luggageFee: 50000,
        childDisc: 50,
        images: JSON.stringify([image]),
        titleId: `${name} & Bandung Raya`,
        titleEn: `${name} & Bandung Raya`,
        titleZh: name,
        descId: `Rute wisata menuju ${name} dengan pilihan destinasi sekitar Bandung Raya.`,
        descEn: `A Bandung Raya route to ${name} with nearby destinations included.`,
        descZh: `探索${name}及其周边景点。`,
        stops: {
          create: [name, next, nextNext].map((stopName, stopIndex) => ({
            order: stopIndex + 1,
            nameId: stopName,
            nameEn: stopName,
            nameZh: stopName,
            time: stopIndex === 0 ? "09:00" : stopIndex === 1 ? "12:00" : "15:00",
            duration: stopIndex === 0 ? 120 : 90
          }))
        }
      }
    });
  }

  console.log(`Destination seed complete: ${destinations.length} tour routes upserted.`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
}).finally(() => prisma.$disconnect());
