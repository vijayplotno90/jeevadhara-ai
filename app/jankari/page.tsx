import Link from "next/link";
import { Newspaper, Droplets, Sun, Sprout, ClipboardList, GraduationCap } from "lucide-react";
import AdvisoryChat from "./AdvisoryChat";

// Government scheme names, program details, and agronomic recommendations
// below are real public information (PM-KUSUM, e-NAM, PMFBY, PM-PRANAM,
// AWD paddy irrigation, etc.) -- described here in original wording, not
// copied from any prior project's copy.
const ADVISORIES = [
  {
    icon: Droplets,
    tag: "Water Advisory",
    title: "Alternate Wetting & Drying (AWD) for paddy — cut water use without losing yield",
    body: "ICAR recommends letting standing water drop about 15cm below the soil surface before re-flooding to 5cm, instead of keeping paddy fields continuously flooded. Field trials show 15–30% water savings with no yield penalty.",
    tip: "A simple perforated \"pani pipe\" pushed into the soil lets you see the water table without guessing.",
    source: "ICAR / IRRI water management guidance",
  },
  {
    icon: Sun,
    tag: "Govt Scheme",
    title: "PM-KUSUM — solar irrigation pumps at 60–90% subsidy",
    body: "The PM-KUSUM scheme subsidizes standalone solar pumps for farmers, routed through state agencies (TSREDCO in Telangana). A subsidized 5HP solar pump can save tens of thousands of rupees a year versus running a diesel pump.",
    tip: "Applications are typically seasonal — apply well before the Kharif sowing window to get installation done in time.",
    source: "Ministry of New & Renewable Energy",
  },
  {
    icon: Sprout,
    tag: "Soil Health",
    title: "PM-PRANAM — incentives for cutting chemical fertiliser use",
    body: "States that reduce chemical fertiliser consumption share the subsidy savings under PM-PRANAM. Farmers switching part of their input to nano urea and bio-fertilisers are seeing comparable or better yields with lower cost.",
    tip: "A 500ml nano urea bottle is designed to substitute for a full 45kg urea bag — most effective applied via foliar spray.",
    source: "Ministry of Chemicals & Fertilisers",
  },
  {
    icon: ClipboardList,
    tag: "Crop Insurance",
    title: "PMFBY — subsidised crop insurance against weather loss",
    body: "The Pradhan Mantri Fasal Bima Yojana covers yield loss from drought, flood, and pest/disease at a low farmer premium (as little as 1.5–2% of sum insured for most crops), with the rest subsidised by the government.",
    tip: "Enrollment windows are tied to the sowing season — check with your local bank or CSC before the cut-off.",
    source: "pmfby.gov.in",
  },
  {
    icon: Newspaper,
    tag: "Market Access",
    title: "e-NAM — sell to buyers across India, not just your local mandi",
    body: "e-NAM links over a thousand mandis nationwide onto one electronic trading platform, so an FPO or individual farmer can list produce and receive bids from buyers outside their own district — reducing dependence on a single local middleman.",
    tip: "Registration needs land records and an Aadhaar-linked bank account — listing itself is free.",
    source: "enam.gov.in",
  },
];

const CLIMATE_OUTLOOK = [
  {
    label: "El Niño years",
    summary: "Weaker monsoon, longer dry spells, heat stress on livestock. Higher risk to water-hungry kharif crops like paddy and sugarcane.",
    actions: [
      "Favor millets (ragi, jowar, bajra) over paddy where water is uncertain.",
      "Mulch and switch to drip irrigation where possible — meaningfully cuts water demand.",
      "Provide shade and extra cool water access for livestock during heat spikes.",
    ],
  },
  {
    label: "La Niña years",
    summary: "Above-normal rainfall, higher flood risk in low-lying fields. Generally favorable for kharif paddy and groundwater recharge.",
    actions: [
      "Raised-bed cultivation and drainage channels reduce waterlogging risk.",
      "Consider flood-tolerant paddy varieties in flood-prone plots.",
      "Watch for fungal disease pressure (blast, blight) in sustained humid weeks.",
    ],
  },
];

const QUICK_LINKS = [
  { icon: GraduationCap, label: "Find a service or expert", href: "/services" },
  { icon: Sprout, label: "Browse Mandi Rates", href: "/mandi-rates" },
  { icon: Sun, label: "Egg Market rates", href: "/egg-prices" },
];

export default function JankariPage() {
  return (
    <div className="min-h-screen">
      <div className="bg-gradient-to-r from-farm-green to-emerald-700 px-4 py-10">
        <div className="mx-auto max-w-7xl">
          <h1 className="font-serif text-3xl font-bold text-white">🧑‍🌾 Kisan Expert Desk</h1>
          <p className="mt-1 max-w-2xl text-green-100">
            Ask a crop question, check the season's climate outlook, and see what current
            government schemes actually apply to you.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <AdvisoryChat />
          </div>

          <div className="space-y-3">
            {QUICK_LINKS.map((q) => (
              <Link
                key={q.href}
                href={q.href}
                className="flex items-center gap-3 rounded-xl border border-gray-100 bg-white p-4 shadow-soft transition hover:-translate-y-0.5 hover:shadow-card"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-green-50 text-farm-green">
                  <q.icon className="h-4.5 w-4.5" />
                </span>
                <span className="text-sm font-semibold text-gray-900">{q.label}</span>
              </Link>
            ))}
          </div>
        </div>

        <div className="mt-14">
          <span className="text-xs font-semibold uppercase tracking-widest text-farm-green">Season outlook</span>
          <h2 className="mt-1 font-serif text-2xl font-bold text-gray-900">El Niño / La Niña — what it means for your fields</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {CLIMATE_OUTLOOK.map((c) => (
              <div key={c.label} className="rounded-2xl border border-gray-100 bg-white p-6 shadow-soft">
                <h3 className="font-serif text-lg font-bold text-gray-900">{c.label}</h3>
                <p className="mt-2 text-sm text-gray-500">{c.summary}</p>
                <ul className="mt-4 space-y-2">
                  {c.actions.map((a) => (
                    <li key={a} className="flex gap-2 text-sm text-gray-700">
                      <span className="text-farm-green">•</span>
                      {a}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-14">
          <span className="text-xs font-semibold uppercase tracking-widest text-farm-green">Act on this</span>
          <h2 className="mt-1 font-serif text-2xl font-bold text-gray-900">Current advisories & schemes</h2>
          <div className="mt-6 space-y-4">
            {ADVISORIES.map((a) => (
              <div key={a.title} className="flex gap-4 rounded-2xl border border-gray-100 bg-white p-6 shadow-soft">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-green-50 text-farm-green">
                  <a.icon className="h-5 w-5" />
                </span>
                <div>
                  <span className="text-[10px] font-semibold uppercase tracking-wide text-farm-green">{a.tag}</span>
                  <h3 className="mt-1 font-serif text-base font-bold text-gray-900">{a.title}</h3>
                  <p className="mt-1.5 text-sm text-gray-600">{a.body}</p>
                  <p className="mt-2 text-xs text-gray-500">💡 {a.tip}</p>
                  <p className="mt-2 text-[11px] text-gray-400">Source: {a.source}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
