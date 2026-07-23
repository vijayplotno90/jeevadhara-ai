import { getServiceCategories } from "@/lib/services";
import ServicesGrid from "./ServicesGrid";

export default async function ServicesPage() {
  const categories = await getServiceCategories();

  return (
    <div className="min-h-screen">
      <div className="bg-gradient-to-r from-farm-green to-emerald-700 px-4 py-10">
        <div className="mx-auto max-w-7xl">
          <h1 className="font-serif text-3xl font-bold text-white">Service Hub</h1>
          <p className="mt-1 text-green-100">
            Banking, irrigation, veterinary, drone spraying, and government schemes — one place
            to find who to call.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <ServicesGrid categories={categories} />
      </div>
    </div>
  );
}
