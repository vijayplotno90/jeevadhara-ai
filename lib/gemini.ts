import { GoogleGenAI } from "@google/genai";
import { logAgentDecision } from "./agentLog";

// Vertex AI (Gemini) — this single integration satisfies both hackathon
// hard requirements at once: (1) "at least one Google Cloud product" and
// (2) "at least one Gemini API call in the deployed application."
//
// On the SDK: @google-cloud/vertexai (used here originally) was already
// past Google's stated removal date by the time this was caught
// (deprecated Jun 24 2025, removal Jun 24 2026 -- today is past that).
// @google/genai is the current, actively maintained replacement, and
// supports the same Vertex AI backend via `vertexai: true`.
//
// On initialization: the client is created lazily, on first actual call,
// not at module load. Creating it eagerly at the top of this file crashed
// `next build` outright the moment GCP_PROJECT_ID was unset -- Next
// statically evaluates route modules during the build's page-data
// collection step, so any top-level code runs even with zero requests.
// Every function below goes through getClient() instead.
let client: GoogleGenAI | null = null;

function getClient(): GoogleGenAI {
  if (!client) {
    if (!process.env.GCP_PROJECT_ID) {
      throw new Error("GCP_PROJECT_ID is not set. Copy .env.example to .env.local.");
    }
    // On Vercel there's no persistent filesystem to point
    // GOOGLE_APPLICATION_CREDENTIALS at a key file, so we accept the
    // service account JSON directly via GCP_SERVICE_ACCOUNT_JSON (paste
    // the whole key file content as one env var). Locally,
    // GOOGLE_APPLICATION_CREDENTIALS (a file path) still works as a
    // fallback via Application Default Credentials, so
    // `gcloud auth application-default login` works too.
    const credentials = process.env.GCP_SERVICE_ACCOUNT_JSON
      ? JSON.parse(process.env.GCP_SERVICE_ACCOUNT_JSON)
      : undefined;

    client = new GoogleGenAI({
      vertexai: true,
      project: process.env.GCP_PROJECT_ID,
      location: process.env.GCP_LOCATION || "asia-south1",
      googleAuthOptions: credentials ? { credentials } : undefined,
    });
  }
  return client;
}

// NOTE ON MODEL ID: verify this against the Vertex AI Model Garden console
// before relying on it -- Gemini model names churn fast (gemini-1.5-flash,
// used here originally on 2026-07-10, was already fully shut down/404 by
// the time this was caught the same day). gemini-2.5-flash is the current
// stable GA choice as of this writing; re-check before the demo video is
// recorded in case it's moved again by August.
const MODEL = "gemini-2.5-flash";

/**
 * Agent 1 — Crop Advisory.
 * Farmer asks a question; Gemini answers using their crop/district context.
 * Every call is logged to agent_logs (input, output, timestamp) — this is
 * required evidence per the XPRIZE rules, not optional telemetry.
 */
export async function cropAdvisoryAgent(params: {
  farmerId: string | null; // null = guest asked without logging in -- Kisan Expert Desk is open to all
  question: string;
  cropContext: string; // e.g. "paddy, Solipeta village, Telangana, kharif season"
}) {
  const prompt = `You are an agricultural advisor for smallholder farmers in Telangana, India.
Farmer context: ${params.cropContext}
Farmer question: ${params.question}

Give a concise, practical answer (max 150 words). If the question is about pests, disease, or
irrigation timing, be specific to Telangana growing conditions.`;

  const result = await getClient().models.generateContent({ model: MODEL, contents: prompt });
  const output = extractText(result);

  const logId = await logAgentDecision({
    agentName: "crop_advisory",
    farmerId: params.farmerId,
    input: { question: params.question, cropContext: params.cropContext },
    output: { answer: output },
  });

  return { answer: output, logId };
}

/**
 * Agent 2 — Listing Optimization (multimodal).
 * Farmer uploads a photo + short note; Gemini generates title, description,
 * category. Removes friction for low-literacy users.
 */
export async function listingOptimizationAgent(params: {
  farmerId: string;
  imageBase64: string;
  mimeType: string;
  farmerNote: string;
}) {
  const prompt = `You are helping a farmer list a product for sale on an online marketplace.
The farmer's note (may be in Telugu or broken English): "${params.farmerNote}"

Based on the image and the note, respond in strict JSON with keys:
title (string, max 8 words), description (string, max 40 words, appealing to consumers),
category (one of: produce, livestock, honey, nursery, tools, vehicles), suggested_unit (e.g. "per kg", "per dozen").`;

  const result = await getClient().models.generateContent({
    model: MODEL,
    contents: [
      {
        role: "user",
        parts: [
          { text: prompt },
          { inlineData: { mimeType: params.mimeType, data: params.imageBase64 } },
        ],
      },
    ],
  });

  const raw = extractText(result);
  const parsed = safeJsonParse(raw);

  const logId = await logAgentDecision({
    agentName: "listing_optimization",
    farmerId: params.farmerId,
    input: { farmerNote: params.farmerNote },
    output: parsed,
  });

  return { ...parsed, logId };
}

/**
 * Agent 3 — Price Recommendation.
 * Gemini + mandi_rates history suggests a listing price, auto-applied
 * unless the farmer overrides it. The override-vs-accept rate is the
 * clearest "AI executes a business decision" evidence point — log both.
 */
export async function priceRecommendationAgent(params: {
  farmerId: string;
  productName: string;
  category: string;
  recentMandiRates: { date: string; pricePerUnit: number; market: string }[];
}) {
  const prompt = `You are a pricing agent for an Indian farmer marketplace.
Product: ${params.productName} (${params.category})
Recent mandi (wholesale market) rates: ${JSON.stringify(params.recentMandiRates)}

Recommend a fair retail listing price per unit that is competitive for the farmer but
attractive to direct-to-consumer buyers (skip the middleman markup, but don't underprice
below mandi rate). Respond in strict JSON: { "recommended_price": number, "reasoning": string (max 30 words) }.`;

  const result = await getClient().models.generateContent({ model: MODEL, contents: prompt });
  const raw = extractText(result);
  const parsed = safeJsonParse(raw);

  const logId = await logAgentDecision({
    agentName: "price_recommendation",
    farmerId: params.farmerId,
    input: { productName: params.productName, recentMandiRates: params.recentMandiRates },
    output: parsed,
  });

  return { ...parsed, logId };
}

// @google/genai's response usually exposes a convenience `.text` getter;
// fall back to walking candidates directly in case a given response shape
// doesn't populate it (e.g. safety-filtered or empty responses).
function extractText(result: { text?: string; candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }> }): string {
  if (typeof result.text === "string" && result.text.length > 0) {
    return result.text;
  }
  return result.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
}

function safeJsonParse(text: string) {
  try {
    const cleaned = text.replace(/```json\n?|```/g, "").trim();
    return JSON.parse(cleaned);
  } catch {
    return { error: "unparseable_model_output", raw: text };
  }
}
