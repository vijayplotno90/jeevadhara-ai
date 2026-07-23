import { getDb } from "./db";

// Service Hub directory. Category list and partner entries are written
// fresh for this build -- named institutions (SBI, NABARD, PMFBY, etc.)
// are real public entities serving Indian farmers broadly, described in
// original wording here, not copied from any prior project's copy or
// partner list. A smaller, honest starting set beats padding to match a
// headline count -- grows for real once providers self-register via
// /auth/signup/provider style flow (not built yet).

export type ServiceProvider = {
  name: string;
  description: string;
  phone?: string;
  website?: string;
};

export type ServiceCategory = {
  slug: string;
  label: string;
  emoji: string;
  description: string;
  providers: ServiceProvider[];
};

export const SERVICE_CATEGORIES: ServiceCategory[] = [
  {
    slug: "banking",
    label: "Banking & Agri-Finance",
    emoji: "🏦",
    description: "Kisan Credit Card, crop loans, and government-backed farm finance.",
    providers: [
      { name: "State Bank of India — Agri Desk", description: "Kisan Credit Card, crop loans, and tractor finance through SBI's dedicated agri banking desk.", phone: "1800 1234", website: "https://sbi.co.in/web/agri-rural" },
      { name: "NABARD", description: "Refinance support for agri lending, and equity/credit guarantee schemes for Farmer Producer Organisations.", website: "https://nabard.org" },
      { name: "Bharat Crop Insurance (PMFBY)", description: "Government-subsidised crop insurance against weather-related yield loss.", website: "https://pmfby.gov.in" },
    ],
  },
  {
    slug: "irrigation",
    label: "Irrigation & Water",
    emoji: "💦",
    description: "Drip/sprinkler installation, borewell drilling, and water management consultation.",
    providers: [
      { name: "PM-KUSUM Solar Pump Desk (TSREDCO)", description: "Subsidised solar irrigation pump installation for Telangana farmers.", website: "https://pmkusum.mnre.gov.in" },
    ],
  },
  {
    slug: "veterinary",
    label: "Veterinary",
    emoji: "🐄",
    description: "On-farm vet visits, livestock vaccination, and health certification.",
    providers: [
      { name: "Telangana Animal Husbandry Dept.", description: "Government veterinary services and livestock health camps by district.", phone: "1800-180-1551" },
    ],
  },
  {
    slug: "drone",
    label: "Drone Spraying",
    emoji: "🚁",
    description: "Drone-based pesticide and nano-fertiliser spraying by trained operators.",
    providers: [
      { name: "Namo Drone Didi network", description: "Women-SHG-operated drone rental for nano-fertiliser and pesticide spraying, roughly Rs350–400/acre.", website: "https://pib.gov.in" },
    ],
  },
  {
    slug: "soil-lab",
    label: "Soil Testing",
    emoji: "🔬",
    description: "Soil health card testing — nutrient levels, pH, and fertiliser recommendations.",
    providers: [
      { name: "Krishi Vigyan Kendra (KVK) Soil Lab", description: "Government soil testing labs — apply through your nearest KVK for a free or subsidised soil health card." },
    ],
  },
  {
    slug: "rental",
    label: "Equipment Rental",
    emoji: "🚜",
    description: "Rent tractors, tillers, and harvesters by the day instead of buying.",
    providers: [
      { name: "Custom Hiring Centres (CHC)", description: "Government-supported farm equipment rental centres — tractors, rotavators, and harvesters by the hour or day." },
    ],
  },
  {
    slug: "schemes",
    label: "Government Schemes",
    emoji: "📋",
    description: "Subsidies and benefits you may already qualify for.",
    providers: [
      { name: "PM-PRANAM", description: "State-level incentives for reducing chemical fertiliser use in favor of nano urea and bio-fertilisers." },
      { name: "e-NAM", description: "Sell produce to buyers across India through the national electronic mandi trading platform.", website: "https://enam.gov.in" },
    ],
  },
  {
    slug: "expert-visit",
    label: "Expert Farm Visit",
    emoji: "👨‍🌾",
    description: "Book an agronomist or horticulture specialist to visit your farm.",
    providers: [
      { name: "Kisan Call Centre", description: "Free helpline connecting farmers to agricultural experts for advice and visit requests.", phone: "1800-180-1551" },
    ],
  },
];

export async function getServiceCategories(): Promise<ServiceCategory[]> {
  try {
    const db = getDb();
    const { rows: cats } = await db.query(
      `SELECT id, slug, label, emoji, description FROM service_categories ORDER BY label`
    );
    if (cats.length > 0) {
      const { rows: providers } = await db.query(
        `SELECT category_id AS "categoryId", name, description, phone, website
         FROM service_providers WHERE is_verified = true ORDER BY name`
      );
      return cats.map((c) => ({
        slug: c.slug,
        label: c.label,
        emoji: c.emoji,
        description: c.description,
        providers: providers.filter((p: { categoryId: string }) => p.categoryId === c.id),
      }));
    }
  } catch {
    // Cloud SQL not provisioned yet (task #12) or tables empty -- fall through to seed data.
  }
  return SERVICE_CATEGORIES;
}
