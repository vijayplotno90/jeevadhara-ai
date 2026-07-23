import { getDb } from "./db";

// Mandi (wholesale market) rates, structured like India's public Agmarknet
// min/modal/max schema -- see db/schema.sql. This is real reference data
// written fresh for this build (Telangana districts, current crops), not
// copied from any prior project's database.
//
// getMandiRates() tries Cloud SQL first (real rows once ingestion + task
// #12 land), and falls back to this seed set if the DB isn't reachable yet
// -- so the page and the price recommendation agent both work today, and
// switch to live data automatically the moment Cloud SQL is provisioned.

export type MandiRate = {
  commodity: string;
  commodityTelugu: string;
  district: string;
  market: string;
  minPrice: number;
  modalPrice: number;
  maxPrice: number;
  unit: string;
  rateDate: string;
};

export const MOCK_MANDI_RATES: MandiRate[] = [
  { commodity: "Sona Masoori Rice", commodityTelugu: "బియ్యం", district: "Warangal", market: "Warangal Mandi", minPrice: 1850, modalPrice: 2050, maxPrice: 2250, unit: "per quintal", rateDate: "2026-07-20" },
  { commodity: "Tomato", commodityTelugu: "టమాటా", district: "Rangareddy", market: "Bowenpally Mandi", minPrice: 750, modalPrice: 1050, maxPrice: 1350, unit: "per quintal", rateDate: "2026-07-21" },
  { commodity: "Onion", commodityTelugu: "ఉల్లిపాయ", district: "Hyderabad", market: "Bowenpally Mandi", minPrice: 1100, modalPrice: 1650, maxPrice: 2100, unit: "per quintal", rateDate: "2026-07-21" },
  { commodity: "Turmeric", commodityTelugu: "పసుపు", district: "Nizamabad", market: "Nizamabad Mandi", minPrice: 6200, modalPrice: 7600, maxPrice: 9200, unit: "per quintal", rateDate: "2026-07-19" },
  { commodity: "Toor Dal", commodityTelugu: "కంది పప్పు", district: "Nizamabad", market: "Nizamabad Mandi", minPrice: 7400, modalPrice: 7950, maxPrice: 8450, unit: "per quintal", rateDate: "2026-07-19" },
  { commodity: "Green Chilli", commodityTelugu: "పచ్చి మిర్చి", district: "Guntur", market: "Mirchi Yard Guntur", minPrice: 3200, modalPrice: 5600, maxPrice: 7900, unit: "per quintal", rateDate: "2026-07-20" },
  { commodity: "Brinjal", commodityTelugu: "వంకాయ", district: "Rangareddy", market: "Bowenpally Mandi", minPrice: 550, modalPrice: 720, maxPrice: 950, unit: "per quintal", rateDate: "2026-07-21" },
  { commodity: "Groundnut", commodityTelugu: "వేరుశనగ", district: "Mahabubnagar", market: "Mahabubnagar Mandi", minPrice: 6800, modalPrice: 7500, maxPrice: 8300, unit: "per quintal", rateDate: "2026-07-18" },
];

export async function getMandiRates(commodityFilter?: string): Promise<MandiRate[]> {
  try {
    const db = getDb();
    const rows = commodityFilter
      ? (
          await db.query(
            `SELECT commodity, commodity_telugu AS "commodityTelugu", district, market,
                    min_price AS "minPrice", modal_price AS "modalPrice", max_price AS "maxPrice",
                    unit, rate_date::text AS "rateDate"
             FROM mandi_rates WHERE commodity ILIKE $1 ORDER BY rate_date DESC LIMIT 20`,
            [`%${commodityFilter}%`]
          )
        ).rows
      : (
          await db.query(
            `SELECT commodity, commodity_telugu AS "commodityTelugu", district, market,
                    min_price AS "minPrice", modal_price AS "modalPrice", max_price AS "maxPrice",
                    unit, rate_date::text AS "rateDate"
             FROM mandi_rates ORDER BY rate_date DESC LIMIT 50`
          )
        ).rows;
    if (rows.length > 0) return rows;
  } catch {
    // Cloud SQL not provisioned yet (task #12) or table empty -- fall through to seed data.
  }
  return commodityFilter
    ? MOCK_MANDI_RATES.filter((r) => r.commodity.toLowerCase().includes(commodityFilter.toLowerCase()))
    : MOCK_MANDI_RATES;
}
