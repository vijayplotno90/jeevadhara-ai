import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import { CATEGORIES, MOCK_PRODUCTS } from "@/lib/mockProducts";

export default async function MarketplacePage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const params = await searchParams;
  const active = params?.category || "all";
  const products =
    active === "all" ? MOCK_PRODUCTS : MOCK_PRODUCTS.filter((p) => p.category === active);

  return (
    <div className="min-h-screen">
      <div className="bg-gradient-to-r from-farm-green to-emerald-700 px-4 py-10">
        <div className="mx-auto max-w-7xl">
          <h1 className="font-serif text-3xl font-bold text-white">Marketplace</h1>
          <p className="mt-1 text-green-100">
            Direct from farmers in Solipeta and neighboring villages — prices flagged
            "AI priced" come from the Gemini price recommendation agent.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex gap-2 overflow-x-auto pb-2">
          {CATEGORIES.map((c) => (
            <Link
              key={c.value}
              href={c.value === "all" ? "/marketplace" : `/marketplace?category=${c.value}`}
              className={`whitespace-nowrap rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                active === c.value
                  ? "border-farm-green bg-farm-green text-white"
                  : "border-gray-300 bg-white text-gray-600 hover:border-farm-green"
              }`}
            >
              {c.emoji} {c.label}
            </Link>
          ))}
        </div>

        <p className="mt-5 mb-5 text-sm text-gray-500">
          {products.length} listing{products.length !== 1 ? "s" : ""} — placeholder catalog,
          live once the first pilot farmers list real products.
        </p>

        {products.length === 0 ? (
          <div className="py-20 text-center text-gray-400">
            <p className="mb-4 text-5xl">🌾</p>
            <p className="text-lg">No products in this category yet</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </div>

      <div className="border-t border-green-200 bg-green-50 px-4 py-8">
        <div className="mx-auto max-w-7xl text-center">
          <p className="font-semibold text-green-800">Are you a farmer?</p>
          <p className="mt-1 text-sm text-green-700">
            List your produce — the price agent suggests a fair rate in seconds.
          </p>
          <Link
            href="/auth?role=farmer"
            className="mt-3 inline-block rounded-lg bg-farm-green px-6 py-2 text-sm font-medium text-white hover:bg-emerald-900"
          >
            Register as Farmer
          </Link>
        </div>
      </div>
    </div>
  );
}
