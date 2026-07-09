import { getDb } from "./db";

/**
 * Every agent decision that matters (price set, listing generated, advisory
 * given) gets logged here. This is required evidence per the XPRIZE rules
 * ("Non-Negotiables" #2), not a nice-to-have — judges look for the
 * override-vs-accept rate as proof AI isn't decorative.
 */
export async function logAgentDecision(params: {
  agentName: "crop_advisory" | "listing_optimization" | "price_recommendation";
  farmerId: string;
  input: Record<string, unknown>;
  output: Record<string, unknown>;
  farmerOverride?: boolean;
}) {
  const db = getDb();
  await db.query(
    `INSERT INTO agent_logs (agent_name, farmer_id, input, output, farmer_override, created_at)
     VALUES ($1, $2, $3, $4, $5, now())`,
    [
      params.agentName,
      params.farmerId,
      JSON.stringify(params.input),
      JSON.stringify(params.output),
      params.farmerOverride ?? null,
    ]
  );
}
