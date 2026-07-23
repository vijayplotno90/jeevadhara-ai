"use client";

import { useState } from "react";
import { Sparkles, MapPin } from "lucide-react";
import type { MockProduct } from "@/lib/mockProducts";

export default function ProductCard({ product }: { product: MockProduct }) {
  // Stock photo (LoremFlickr) is a network dependency -- if it 404s or the
  // request fails, fall back to the emoji tile instead of a broken image icon.
  const [imgFailed, setImgFailed] = useState(false);

  return (
    <div className="group rounded-2xl border border-gray-100 bg-white p-5 shadow-soft transition hover:-translate-y-1 hover:shadow-card">
      <div className="flex h-32 items-center justify-center overflow-hidden rounded-xl bg-gray-50 text-6xl">
        {imgFailed ? (
          product.emoji
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={product.imageUrl}
            alt={product.name}
            className="h-full w-full object-cover"
            loading="lazy"
            onError={() => setImgFailed(true)}
          />
        )}
      </div>
      <h3 className="mt-4 font-serif text-base font-bold text-gray-900">{product.name}</h3>
      <div className="mt-1 flex items-center gap-1 text-xs text-gray-500">
        <MapPin className="h-3 w-3" />
        {product.farmerName} · {product.village}
      </div>
      <div className="mt-3 flex items-center justify-between">
        <p className="text-lg font-bold text-farm-green">
          ₹{product.price.toLocaleString("en-IN")}
          <span className="ml-1 text-xs font-normal text-gray-400">{product.unit}</span>
        </p>
        {product.aiPriced && (
          <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-2 py-1 text-[10px] font-semibold text-farm-green">
            <Sparkles className="h-3 w-3" />
            AI priced
          </span>
        )}
      </div>
    </div>
  );
}
