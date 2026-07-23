import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getSession } from "@/lib/auth";
import { cropAdvisoryAgent } from "@/lib/gemini";

const bodySchema = z.object({
  question: z.string().min(5).max(500),
  cropContext: z.string().min(2).max(200),
});

/**
 * Agent 1 endpoint -- Kisan Expert Desk. Open to guests as well as logged-in
 * farmers (unlike listing/price, which are farmer-account actions, a crop
 * question is general knowledge -- no reason to wall it off, and it's a
 * lower-friction way for judges to see a Gemini call actually run).
 */
export async function POST(req: NextRequest) {
  const session = await getSession();

  const parsed = bodySchema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  try {
    const result = await cropAdvisoryAgent({
      farmerId: session?.userId ?? null,
      question: parsed.data.question,
      cropContext: parsed.data.cropContext,
    });
    return NextResponse.json(result);
  } catch (err) {
    console.error("cropAdvisoryAgent failed:", err);
    return NextResponse.json({ error: "agent_unavailable" }, { status: 502 });
  }
}
