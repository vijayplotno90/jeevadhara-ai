import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getSession } from "@/lib/auth";
import { listingOptimizationAgent } from "@/lib/gemini";

const bodySchema = z.object({
  farmerNote: z.string().min(3),
  imageBase64: z.string().min(10),
  mimeType: z.string().min(1),
});

/**
 * Agent 2 endpoint -- farmer uploads a photo + short note, Gemini drafts
 * the listing. This is the first route that actually calls a Gemini agent
 * from user input, not just from library code.
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

  try {
    const suggestion = await listingOptimizationAgent({
      farmerId: session.userId,
      imageBase64: parsed.data.imageBase64,
      mimeType: parsed.data.mimeType,
      farmerNote: parsed.data.farmerNote,
    });
    return NextResponse.json({ suggestion });
  } catch (err) {
    console.error("listingOptimizationAgent failed:", err);
    return NextResponse.json({ error: "agent_unavailable" }, { status: 502 });
  }
}
