import Link from "next/link";
import { getEggPrices } from "@/lib/eggPrices";

export default async function EggPricesPage() {
  const prices = await getEggPrices();

  return (
    <div className="min-h-screen">
      <div className="bg-gradient-to-r from-farm-green to-emerald-700 px-4 py-10">
        <div className="mx-auto max-w-7xl">
          <h1 className="font-serif text-3xl font-bold text-white">🥚 Egg Market</h1>
          <p className="mt-1 text-green-100">Daily rates by egg type — India-wide</p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <p className="mb-6 text-sm text-gray-500">Updated {prices[0]?.rateDate ?? "—"}</p>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {prices.map((p) => (
            <div key={p.eggType} className="rounded-2xl border border-gray-100 bg-white p-5 shadow-soft">
              <h3 className="font-serif text-base font-bold text-gray-900">{p.label}</h3>
              <p className="mt-1 text-xs leading-relaxed text-gray-500">{p.description}</p>
              <p className="mt-4 text-2xl font-bold text-farm-green">
                ₹{p.pricePerPiece.toLocaleString("en-IN")}
                <span className="ml-1 text-xs font-normal text-gray-400">per piece</span>
              </p>
            </div>
          ))}
        </div>

        <p className="mt-6 text-xs text-gray-400">
          NECC white egg rate used as base. Other types are market estimates — actual local prices may vary.
        </p>

        <div className="mt-10 rounded-2xl border border-green-200 bg-green-50 p-6 text-center">
          <p className="font-semibold text-green-800">Sell your eggs on Jeevadhara</p>
          <p className="mt-1 text-sm text-green-700">List farm-fresh eggs — reach buyers directly, update price daily.</p>
          <Link
            href="/farmer/list"
            className="mt-3 inline-block rounded-lg bg-farm-green px-6 py-2 text-sm font-medium text-white hover:bg-emerald-900"
          >
            Start Selling
          </Link>
        </div>
      </div>
    </div>
  );
}
