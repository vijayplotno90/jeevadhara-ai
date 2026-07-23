"use client";

import { useState } from "react";
import { Sparkles, Send, Phone } from "lucide-react";

export default function AdvisoryChat() {
  const [crop, setCrop] = useState("");
  const [village, setVillage] = useState("Solipeta, Telangana");
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleAsk(e: React.FormEvent) {
    e.preventDefault();
    if (!question.trim()) return;
    setLoading(true);
    setError(null);
    setAnswer(null);

    try {
      const cropContext = `${crop || "mixed crops"}, ${village}, current season`;
      const res = await fetch("/api/agents/advisory", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question, cropContext }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "agent_unavailable");
      setAnswer(data.answer);
    } catch {
      setError(
        "Gemini couldn't respond right now (likely GCP/Vertex AI isn't fully configured yet). Try again shortly, or call the Kisan helpline below."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-soft">
      <h3 className="flex items-center gap-2 font-serif text-lg font-bold text-gray-900">
        <Sparkles className="h-5 w-5 text-farm-green" />
        Ask the Crop Advisory Agent
      </h3>
      <p className="mt-1 text-sm text-gray-500">
        Pests, irrigation timing, disease, sowing windows — ask in any language. Gemini answers
        using your crop and district context.
      </p>

      <form onSubmit={handleAsk} className="mt-4 space-y-3">
        <div className="grid gap-3 sm:grid-cols-2">
          <input
            value={crop}
            onChange={(e) => setCrop(e.target.value)}
            placeholder="Crop (e.g. paddy, tomato)"
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-farm-green focus:outline-none focus:ring-1 focus:ring-farm-green"
          />
          <input
            value={village}
            onChange={(e) => setVillage(e.target.value)}
            placeholder="Village, district"
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-farm-green focus:outline-none focus:ring-1 focus:ring-farm-green"
          />
        </div>
        <textarea
          required
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          rows={3}
          placeholder="e.g. Leaves are turning yellow on my tomato plants, what should I do?"
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-farm-green focus:outline-none focus:ring-1 focus:ring-farm-green"
        />
        <button
          type="submit"
          disabled={loading}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-farm-green py-3 text-sm font-semibold text-white transition hover:bg-emerald-900 disabled:opacity-60 sm:w-auto sm:px-6"
        >
          <Send className="h-4 w-4" />
          {loading ? "Asking Gemini..." : "Ask"}
        </button>
      </form>

      {error && <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}

      {answer && (
        <div className="mt-4 rounded-xl border border-green-100 bg-green-50 p-4">
          <p className="flex items-center gap-1.5 text-xs font-semibold text-farm-green">
            <Sparkles className="h-3.5 w-3.5" />
            Gemini crop advisory agent
          </p>
          <p className="mt-2 whitespace-pre-line text-sm text-gray-800">{answer}</p>
        </div>
      )}

      <a
        href="tel:18001801551"
        className="mt-4 flex items-center gap-2 text-xs text-gray-500 hover:text-farm-green"
      >
        <Phone className="h-3.5 w-3.5" />
        Prefer to talk? Kisan Call Centre: 1800-180-1551 (free)
      </a>
    </div>
  );
}
