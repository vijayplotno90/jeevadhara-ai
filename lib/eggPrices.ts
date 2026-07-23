import { getDb } from "./db";

// Egg market rates by type. NECC (National Egg Coordination Committee)
// publishes a daily benchmark for white layer eggs; other types are
// market estimates relative to that benchmark -- same convention the
// broader industry uses. Seed values written fresh for this build.

export type EggPrice = {
  eggType: string;
  label: string;
  description: string;
  pricePerPiece: number;
  rateDate: string;
};

export const EGG_TYPE_META: Record<string, { label: string; description: string }> = {
  white_layer_necc: { label: "White Layer (NECC)", description: "Benchmark NECC wholesale rate — eggs from Leghorn-type white-feathered layer hens. Most widely traded in India." },
  brown: { label: "Brown Eggs", description: "Brown-shelled eggs from breeds like Rhode Island Red — typically a small premium over white layer." },
  country: { label: "Country / Naatu Kodi", description: "Free-range desi eggs from backyard-reared birds — higher price, smaller size, strong local demand." },
  kadaknath: { label: "Kadaknath", description: "Eggs from the Kadaknath breed — premium, prized for nutrition and dark meat lineage." },
  quail: { label: "Quail (Bater) Eggs", description: "Sold by the piece, popular in South Indian markets — priced per egg, not per dozen." },
  duck: { label: "Duck Eggs", description: "Larger, richer-yolked than chicken eggs — steady demand from bakeries and coastal households." },
};

export const MOCK_EGG_PRICES: EggPrice[] = [
  { eggType: "white_layer_necc", label: "White Layer (NECC)", description: EGG_TYPE_META.white_layer_necc.description, pricePerPiece: 5.8, rateDate: "2026-07-23" },
  { eggType: "brown", label: "Brown Eggs", description: EGG_TYPE_META.brown.description, pricePerPiece: 7.2, rateDate: "2026-07-23" },
  { eggType: "country", label: "Country / Naatu Kodi", description: EGG_TYPE_META.country.description, pricePerPiece: 9.5, rateDate: "2026-07-23" },
  { eggType: "kadaknath", label: "Kadaknath", description: EGG_TYPE_META.kadaknath.description, pricePerPiece: 22, rateDate: "2026-07-23" },
  { eggType: "quail", label: "Quail (Bater) Eggs", description: EGG_TYPE_META.quail.description, pricePerPiece: 2.5, rateDate: "2026-07-23" },
  { eggType: "duck", label: "Duck Eggs", description: EGG_TYPE_META.duck.description, pricePerPiece: 11, rateDate: "2026-07-23" },
];

export async function getEggPrices(): Promise<EggPrice[]> {
  try {
    const db = getDb();
    const { rows } = await db.query(
      `SELECT DISTINCT ON (egg_type) egg_type AS "eggType", price_per_piece AS "pricePerPiece", rate_date::text AS "rateDate"
       FROM egg_prices ORDER BY egg_type, rate_date DESC`
    );
    if (rows.length > 0) {
      return rows.map((r: { eggType: string; pricePerPiece: number; rateDate: string }) => ({
        ...r,
        label: EGG_TYPE_META[r.eggType]?.label ?? r.eggType,
        description: EGG_TYPE_META[r.eggType]?.description ?? "",
      }));
    }
  } catch {
    // Cloud SQL not provisioned yet (task #12) or table empty -- fall through to seed data.
  }
  return MOCK_EGG_PRICES;
}
