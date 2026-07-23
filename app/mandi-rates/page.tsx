import { BarChart3 } from "lucide-react";
import { getMandiRates } from "@/lib/mandiRates";

export default async function MandiRatesPage() {
  const rates = await getMandiRates();

  const byDistrict = rates.reduce<Record<string, typeof rates>>((acc, r) => {
    (acc[r.district] ??= []).push(r);
    return acc;
  }, {});

  return (
    <div className="min-h-screen">
      <div className="bg-gradient-to-r from-farm-green to-emerald-700 px-4 py-10">
        <div className="mx-auto max-w-7xl">
          <h1 className="flex items-center gap-2 font-serif text-3xl font-bold text-white">
            <BarChart3 className="h-7 w-7" />
            Mandi Rates
          </h1>
          <p className="mt-1 text-green-100">
            Wholesale market prices by district — this is the same data the price recommendation
            agent reads before suggesting a listing price.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {Object.entries(byDistrict).map(([district, rows]) => (
          <div key={district} className="mb-8">
            <h2 className="mb-3 flex items-center gap-1.5 font-serif text-lg font-bold text-gray-900">
              📍 {district}
            </h2>
            <div className="overflow-x-auto rounded-xl border border-gray-100 shadow-soft">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                  <tr>
                    <th className="px-4 py-3">Crop</th>
                    <th className="px-4 py-3">Telugu</th>
                    <th className="px-4 py-3">Mandi</th>
                    <th className="px-4 py-3 text-right">Min ₹</th>
                    <th className="px-4 py-3 text-right">Modal ₹</th>
                    <th className="px-4 py-3 text-right">Max ₹</th>
                    <th className="px-4 py-3">Unit</th>
                    <th className="px-4 py-3">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 bg-white">
                  {rows.map((r, i) => (
                    <tr key={i} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium text-gray-900">{r.commodity}</td>
                      <td className="px-4 py-3 text-gray-500">{r.commodityTelugu}</td>
                      <td className="px-4 py-3 text-gray-500">{r.market}</td>
                      <td className="px-4 py-3 text-right text-gray-500">₹{r.minPrice.toLocaleString("en-IN")}</td>
                      <td className="px-4 py-3 text-right font-semibold text-farm-green">₹{r.modalPrice.toLocaleString("en-IN")}</td>
                      <td className="px-4 py-3 text-right text-gray-500">₹{r.maxPrice.toLocaleString("en-IN")}</td>
                      <td className="px-4 py-3 text-gray-500">{r.unit}</td>
                      <td className="px-4 py-3 text-gray-500">{r.rateDate}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}
        <p className="mt-2 text-xs text-gray-400">
          Source: Telangana State Agricultural Marketing Board / data.gov.in Agmarknet · {rates.length} entries
        </p>
      </div>
    </div>
  );
}
