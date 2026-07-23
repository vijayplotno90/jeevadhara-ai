"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Sparkles, Upload, Check } from "lucide-react";

type Category = "produce" | "livestock" | "honey" | "nursery" | "tools" | "vehicles";

const CATEGORIES: Category[] = ["produce", "livestock", "honey", "nursery", "tools", "vehicles"];

export default function ListForm() {
  const router = useRouter();

  const [category, setCategory] = useState<Category>("produce");
  const [farmerNote, setFarmerNote] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [step, setStep] = useState<"input" | "review">("input");
  const [loadingAi, setLoadingAi] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // AI suggestions + the log ids needed to record accept-vs-override
  const [listingLogId, setListingLogId] = useState<string | null>(null);
  const [priceLogId, setPriceLogId] = useState<string | null>(null);
  const [originalTitle, setOriginalTitle] = useState("");
  const [originalPrice, setOriginalPrice] = useState<number | null>(null);

  // Editable final fields
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [unit, setUnit] = useState("per kg");
  const [price, setPrice] = useState("");
  const [stockQty, setStockQty] = useState("1");

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    const reader = new FileReader();
    reader.onload = () => setImagePreview(reader.result as string);
    reader.readAsDataURL(file);
  }

  async function handleGetSuggestions() {
    if (!imageFile || !farmerNote.trim()) {
      setError("Add a photo and a short note first.");
      return;
    }
    setError(null);
    setLoadingAi(true);

    try {
      const base64 = await fileToBase64(imageFile);

      const listingRes = await fetch("/api/agents/listing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ farmerNote, imageBase64: base64, mimeType: imageFile.type }),
      });
      const listingData = await listingRes.json();
      if (!listingRes.ok) throw new Error(listingData.error ?? "listing_agent_failed");

      const suggestion = listingData.suggestion;
      setListingLogId(suggestion.logId ?? null);
      setTitle(suggestion.title ?? "");
      setOriginalTitle(suggestion.title ?? "");
      setDescription(suggestion.description ?? "");
      setUnit(suggestion.suggested_unit ?? "per kg");
      if (suggestion.category && CATEGORIES.includes(suggestion.category)) {
        setCategory(suggestion.category);
      }

      const priceRes = await fetch("/api/agents/price", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productName: suggestion.title ?? farmerNote,
          category: suggestion.category ?? category,
        }),
      });
      const priceData = await priceRes.json();
      if (!priceRes.ok) throw new Error(priceData.error ?? "price_agent_failed");

      const priceSuggestion = priceData.suggestion;
      setPriceLogId(priceSuggestion.logId ?? null);
      const suggestedPrice = Number(priceSuggestion.recommended_price ?? 0);
      setPrice(suggestedPrice ? String(suggestedPrice) : "");
      setOriginalPrice(suggestedPrice || null);

      setStep("review");
    } catch {
      setError(
        "The AI agents couldn't respond right now (likely GCP/Vertex AI isn't fully configured yet). You can still fill in the listing manually below."
      );
      setStep("review");
    } finally {
      setLoadingAi(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          category,
          title,
          description,
          unit,
          price: Number(price),
          stockQty: Number(stockQty),
          listingLogId: listingLogId ?? undefined,
          listingOverridden: listingLogId ? title !== originalTitle : undefined,
          priceLogId: priceLogId ?? undefined,
          priceOverridden: priceLogId ? Number(price) !== originalPrice : undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError("Couldn't save the listing. Please try again.");
        return;
      }
      router.push("/marketplace");
      router.refresh();
    } finally {
      setSubmitting(false);
    }
  }

  if (step === "input") {
    return (
      <div className="mt-8 space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700">Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as Category)}
            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm capitalize focus:border-farm-green focus:outline-none focus:ring-1 focus:ring-farm-green"
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c} className="capitalize">
                {c}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Photo</label>
          <label className="mt-1 flex h-40 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 text-gray-400 hover:border-farm-green hover:text-farm-green">
            {imagePreview ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={imagePreview} alt="Preview" className="h-full w-full rounded-xl object-cover" />
            ) : (
              <>
                <Upload className="h-8 w-8" />
                <span className="mt-2 text-sm">Tap to add a photo</span>
              </>
            )}
            <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
          </label>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Tell us about it (any language is fine)
          </label>
          <textarea
            value={farmerNote}
            onChange={(e) => setFarmerNote(e.target.value)}
            rows={3}
            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-farm-green focus:outline-none focus:ring-1 focus:ring-farm-green"
            placeholder="e.g. 5kg fresh tomatoes, picked this morning"
          />
        </div>

        {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}

        <button
          onClick={handleGetSuggestions}
          disabled={loadingAi}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-farm-green py-3 text-sm font-semibold text-white transition hover:bg-emerald-900 disabled:opacity-60"
        >
          <Sparkles className="h-4 w-4" />
          {loadingAi ? "Asking Gemini..." : "Get AI suggestions"}
        </button>

        <button
          onClick={() => setStep("review")}
          className="w-full text-center text-sm text-gray-400 hover:text-gray-600"
        >
          Skip AI, enter details manually
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8 space-y-5">
      {(listingLogId || priceLogId) && (
        <p className="flex items-center gap-1.5 rounded-lg bg-green-50 px-3 py-2 text-xs text-farm-green">
          <Sparkles className="h-3.5 w-3.5" />
          Reviewed by Gemini — edit anything below before publishing.
        </p>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700">Title</label>
        <input
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-farm-green focus:outline-none focus:ring-1 focus:ring-farm-green"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={2}
          className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-farm-green focus:outline-none focus:ring-1 focus:ring-farm-green"
        />
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div>
          <label className="block text-sm font-medium text-gray-700">Price (₹)</label>
          <input
            required
            type="number"
            min="1"
            step="0.01"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-farm-green focus:outline-none focus:ring-1 focus:ring-farm-green"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Unit</label>
          <input
            value={unit}
            onChange={(e) => setUnit(e.target.value)}
            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-farm-green focus:outline-none focus:ring-1 focus:ring-farm-green"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Stock qty</label>
          <input
            required
            type="number"
            min="0"
            step="0.1"
            value={stockQty}
            onChange={(e) => setStockQty(e.target.value)}
            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-farm-green focus:outline-none focus:ring-1 focus:ring-farm-green"
          />
        </div>
      </div>

      {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}

      <button
        type="submit"
        disabled={submitting}
        className="flex w-full items-center justify-center gap-2 rounded-lg bg-farm-green py-3 text-sm font-semibold text-white transition hover:bg-emerald-900 disabled:opacity-60"
      >
        <Check className="h-4 w-4" />
        {submitting ? "Publishing..." : "Publish listing"}
      </button>
    </form>
  );
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      // Strip the "data:image/jpeg;base64," prefix -- Gemini wants raw base64.
      resolve(result.split(",")[1]);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
