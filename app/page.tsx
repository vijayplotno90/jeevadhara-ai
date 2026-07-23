import Link from "next/link";
import {
  ArrowRight, Leaf, ShieldCheck, IndianRupee,
  Sparkles, BarChart3, Camera, MessageCircle,
} from "lucide-react";
import { CATEGORIES } from "@/lib/mockProducts";

const AI_AGENTS = [
  {
    icon: BarChart3,
    title: "Price Recommendation Agent",
    desc: "Gemini reads live mandi rates and suggests a fair listing price for every product — the farmer can accept or override it, and we log which happens.",
  },
  {
    icon: Camera,
    title: "Listing Optimization Agent",
    desc: "A farmer uploads one photo and a short voice note or text. Gemini writes the title, description, and category — no typing required.",
  },
  {
    icon: MessageCircle,
    title: "Crop Advisory Agent",
    desc: "Ask a question about pests, irrigation, or timing in plain language. Gemini answers using the farmer's crop and district context.",
  },
];

const VALUE_PROPS = [
  { icon: IndianRupee, title: "Fair prices", desc: "No middlemen markup — farmers keep more of what buyers pay.", tint: "bg-green-50 text-green-700" },
  { icon: ShieldCheck, title: "Real transactions", desc: "Every order is a verified payment, not a demo number.", tint: "bg-amber-50 text-amber-700" },
  { icon: Sparkles, title: "AI-run, not AI-decorated", desc: "Pricing, listings, and advisory are executed by agents in production, logged decision by decision.", tint: "bg-orange-50 text-orange-700" },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-gradient-radial from-green-50/80 to-transparent" />
        <div className="mx-auto grid max-w-7xl gap-10 px-4 pt-12 pb-20 sm:px-6 md:grid-cols-2 md:items-center md:gap-16 md:pt-20 lg:px-8">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-green-200 bg-green-50 px-3 py-1 text-xs font-medium text-green-700">
              <Leaf className="h-3.5 w-3.5" />
              Piloting from Solipeta village, Telangana
            </span>
            <h1 className="mt-5 font-serif text-4xl font-bold leading-[1.05] tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
              A farmer marketplace{" "}
              <span className="text-farm-green">run by AI agents</span>
            </h1>
            <p className="mt-5 max-w-xl text-lg text-gray-500">
              Jeevadhara connects farmers directly to buyers across Telangana. Gemini agents
              price every listing, write every product description, and answer every crop
              question — live, in production, not as a demo.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link href="/marketplace" className="inline-flex h-12 items-center gap-2 rounded-lg bg-farm-green px-6 text-sm font-semibold text-white shadow-glow transition hover:bg-emerald-900">
                Browse the marketplace
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/auth" className="inline-flex h-12 items-center rounded-lg border border-gray-200 bg-white px-6 text-sm font-semibold text-gray-900 transition hover:border-farm-green hover:text-farm-green">
                Sell your harvest
              </Link>
            </div>
          </div>

          <div className="relative hidden md:block">
            <div className="absolute -inset-4 -z-10 rounded-3xl bg-gradient-to-br from-green-100 to-amber-100 blur-2xl" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://loremflickr.com/800/600/indianfarmer,harvest"
              alt="Farmer harvesting produce"
              className="aspect-[4/3] w-full rounded-3xl object-cover shadow-glow"
            />
            <div className="absolute -bottom-6 -left-6 rounded-2xl border border-gray-200 bg-white p-4 shadow-card">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-50 text-green-700">
                  <Sparkles className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Priced by</p>
                  <p className="text-sm font-semibold text-gray-900">Gemini price agent</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="border-y border-gray-100 bg-gray-50/60">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between gap-4">
            <div>
              <span className="text-xs font-semibold uppercase tracking-widest text-farm-green">Explore</span>
              <h2 className="mt-1 font-serif text-2xl font-bold text-gray-900 sm:text-3xl">Everything from the farm</h2>
            </div>
          </div>
          <div className="mt-8 grid grid-cols-3 gap-3 sm:grid-cols-6">
            {CATEGORIES.filter((c) => c.value !== "all").map((c) => (
              <Link
                key={c.value}
                href={`/marketplace?category=${c.value}`}
                className="group flex flex-col items-center text-center transition hover:-translate-y-1"
              >
                <div className="flex h-20 w-20 items-center justify-center rounded-full border-2 border-gray-200 bg-white text-4xl shadow-soft transition group-hover:border-farm-green group-hover:shadow-glow">
                  {c.emoji}
                </div>
                <p className="mt-3 text-xs font-bold leading-tight text-gray-900">{c.label}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* AI AGENTS */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-xs font-semibold uppercase tracking-widest text-farm-green">AI-native operations</span>
          <h2 className="mt-3 font-serif text-3xl font-bold text-gray-900 sm:text-4xl">Three agents run this business</h2>
          <p className="mt-3 text-gray-500">Each decision — a price, a listing, an answer — is Gemini, logged.</p>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {AI_AGENTS.map((a) => (
            <div key={a.title} className="rounded-2xl border border-gray-100 bg-white p-6 shadow-soft transition hover:-translate-y-1 hover:shadow-card">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-50 text-farm-green">
                <a.icon className="h-6 w-6" />
              </div>
              <h3 className="mt-4 font-serif text-lg font-bold text-gray-900">{a.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-gray-500">{a.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* VALUE PROPS */}
      <section className="border-y border-gray-100 bg-gray-50/50">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="grid gap-6 md:grid-cols-3">
            {VALUE_PROPS.map((v) => (
              <div key={v.title} className="group rounded-2xl border border-gray-100 bg-white p-6 shadow-soft transition hover:-translate-y-1 hover:shadow-card">
                <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${v.tint}`}>
                  <v.icon className="h-6 w-6" />
                </div>
                <h3 className="mt-4 font-serif text-xl font-bold text-gray-900">{v.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-500">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-farm-green to-emerald-900 p-10 text-white shadow-glow sm:p-16">
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-amber-400/20 blur-3xl" />
          <div className="absolute -bottom-24 -left-10 h-72 w-72 rounded-full bg-orange-400/20 blur-3xl" />
          <div className="relative max-w-2xl">
            <h2 className="font-serif text-3xl font-bold sm:text-4xl">Ready to get started?</h2>
            <p className="mt-4 text-base text-white/85">
              Join the pilot in Solipeta village — list your first product and let the price
              agent do the pricing.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/auth" className="inline-flex h-12 items-center gap-2 rounded-lg bg-farm-gold px-6 text-sm font-semibold text-emerald-950 transition hover:brightness-95">
                Create an account
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/marketplace" className="inline-flex h-12 items-center rounded-lg border border-white/30 bg-white/10 px-6 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/20">
                Browse marketplace
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
