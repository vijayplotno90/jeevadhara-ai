import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getSession } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { priceRecommendationAgent } from "@/lib/gemini";

const bodySchema = z.object({
  productName: z.string().min(2),
  category: z.enum(["produce", "livestock", "honey", "nursery", "tools", "vehicles"]),
});

/**
 * Agent 3 endpoint -- pulls recent mandi_rates for context, then asks
 * Gemini for a recommended price. Returns the log id so the client can
 * report back accept-vs-override once the farmer decides.
 */
export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session || session.role !== "farmer") {
    return NextResponse.json({ error: "farmers_only" }, { status: 403 });
  }

  const parsed = bodySchema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const { productName, category } = parsed.data;

  const db = getDb();
  // mandi_rates is empty until real ingestion is built -- the agent still
  // works with zero rows, it just falls back to general judgment. Real
  // mandi-rate ingestion is tracked separately, not built yet.
  const rates = await db.query(
    `SELECT rate_date::text AS date, price_per_unit AS "pricePerUnit", market
     FROM mandi_rates
     WHERE commodity ILIKE $1
     ORDER BY rate_date DESC
     LIMIT 10`,
    [`%${productName}%`]
  );

  try {
    const suggestion = await priceRecommendationAgent({
      farmerId: session.userId,
      productName,
      category,
      recentMandiRates: rates.rows,
    });
    return NextResponse.json({ suggestion });
  } catch (err) {
    console.error("priceRecommendationAgent failed:", err);
    return NextResponse.json({ error: "agent_unavailable" }, { status: 502 });
  }
}
