import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getSession } from "@/lib/auth";
import { getMandiRates } from "@/lib/mandiRates";
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

  // getMandiRates() queries Cloud SQL first and falls back to the seed set
  // in lib/mandiRates.ts if the DB isn't reachable yet (task #12) or has no
  // matching rows -- the agent always has real reference numbers to reason
  // over, not just its own judgment.
  const rates = await getMandiRates(productName);

  try {
    const suggestion = await priceRecommendationAgent({
      farmerId: session.userId,
      productName,
      category,
      recentMandiRates: rates.map((r) => ({
        date: r.rateDate,
        pricePerUnit: r.modalPrice,
        market: r.market,
      })),
    });
    return NextResponse.json({ suggestion });
  } catch (err) {
    console.error("priceRecommendationAgent failed:", err);
    return NextResponse.json({ error: "agent_unavailable" }, { status: 502 });
  }
}
