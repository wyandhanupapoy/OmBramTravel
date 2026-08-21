import destinationsData from "@/lib/destinationsData.json";

export type DestinationCategory = "Kota & Sejarah" | "Alam & Pegunungan" | "Keluarga & Hiburan" | "Belanja & Kuliner" | "Penginapan & Aktivitas";

const categoryRules: [DestinationCategory, string[]][] = [
  ["Belanja & Kuliner", ["Jalan ", "Street", "Food", "Market", "Mall", "Shopping", "Pasar", "Culinary", "Kuliner", "Resto"]],
  ["Keluarga & Hiburan", ["Trans Studio", "Water", "Zoo", "Rabbit", "Park", "Amazing", "Upside", "Garden", "Kota Mini", "Champion", "Balls", "Fairy", "Art World"]],
  ["Alam & Pegunungan", ["Gunung", "Bukit", "Curug", "Kawah", "Situ ", "Tebing", "Hutan", "Forest", "Tahura", "Goa", "Gua", "Cikole", "Lembang", "Ciwidey", "Pangalengan", "Ranca", "Caringin", "Punclut", "Dago Atas", "Sanghyang", "Kebun Teh"]],
  ["Penginapan & Aktivitas", ["Camping", "Camp", "Resort", "Glamping", "Rafting", "Arung", "Waterpark", "Golf", "Kuda", "Ciwangun", "Riverside"]]
];

export const allDestinations = Array.from(new Set(destinationsData.filter((name) => name.trim().length > 2)));

export function getDestinationCategory(name: string): DestinationCategory {
  const match = categoryRules.find(([, keywords]) => keywords.some((keyword) => name.toLowerCase().includes(keyword.toLowerCase())));
  if (match) return match[0];
  if (/Museum|Gedung|Monumen|Masjid|Alun|Taman|Kampung|Rumah|Merdeka|Sate|Pendidikan|Makam|Babakan|Saung/.test(name)) return "Kota & Sejarah";
  return "Alam & Pegunungan";
}

export function getRandomDestinations(count: number, excluded: string[] = []) {
  const excludedSet = new Set(excluded.map((name) => name.toLowerCase()));
  return [...allDestinations]
    .filter((name) => !excludedSet.has(name.toLowerCase()))
    .sort(() => Math.random() - 0.5)
    .slice(0, count);
}
