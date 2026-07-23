"use client";

import { useState } from "react";
import { Phone, Globe } from "lucide-react";
import type { ServiceCategory } from "@/lib/services";

export default function ServicesGrid({ categories }: { categories: ServiceCategory[] }) {
  const [active, setActive] = useState(categories[0]?.slug ?? "");
  const activeCategory = categories.find((c) => c.slug === active) ?? categories[0];
  const totalProviders = categories.reduce((n, c) => n + c.providers.length, 0);

  return (
    <>
      <p className="mb-4 text-sm text-gray-500">
        {categories.length} categories · {totalProviders} verified partners
      </p>

      <div className="flex flex-wrap gap-2">
        {categories.map((c) => (
          <button
            key={c.slug}
            onClick={() => setActive(c.slug)}
            className={`flex items-center gap-1.5 whitespace-nowrap rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
              active === c.slug
                ? "border-farm-green bg-farm-green text-white"
                : "border-gray-300 bg-white text-gray-600 hover:border-farm-green"
            }`}
          >
            <span>{c.emoji}</span>
            {c.label}
          </button>
        ))}
      </div>

      {activeCategory && (
        <div className="mt-8">
          <h2 className="font-serif text-xl font-bold text-gray-900">
            {activeCategory.emoji} {activeCategory.label}
          </h2>
          <p className="mt-1 text-sm text-gray-500">{activeCategory.description}</p>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            {activeCategory.providers.map((p) => (
              <div key={p.name} className="rounded-2xl border border-gray-100 bg-white p-5 shadow-soft">
                <h3 className="font-serif text-base font-bold text-gray-900">{p.name}</h3>
                <p className="mt-1.5 text-sm text-gray-600">{p.description}</p>
                <div className="mt-3 flex flex-wrap gap-3 text-xs">
                  {p.phone && (
                    <a href={`tel:${p.phone}`} className="flex items-center gap-1 text-farm-green hover:underline">
                      <Phone className="h-3.5 w-3.5" />
                      {p.phone}
                    </a>
                  )}
                  {p.website && (
                    <a href={p.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-farm-green hover:underline">
                      <Globe className="h-3.5 w-3.5" />
                      Website
                    </a>
                  )}
                </div>
              </div>
            ))}
            {activeCategory.providers.length === 0 && (
              <p className="text-sm text-gray-400">No verified partners listed yet in this category.</p>
            )}
          </div>
        </div>
      )}
    </>
  );
}
