# Jeevadhara — Build with Gemini XPRIZE

AI-operated farmer-to-consumer marketplace. Pilot: Solipeta village, Telangana.
Built fresh for the [Build with Gemini XPRIZE](https://xprize.devpost.com) — Small Business
Services category. See `XPRIZE_RULES.md` for the compliance checklist and `DISCLOSURE.md`
for what is/isn't reused from prior work.

## Stack
- Next.js 14 (App Router) + TypeScript + Tailwind
- Cloud SQL for PostgreSQL
- Vertex AI (Gemini) — three agents: crop advisory, listing optimization, price recommendation
- Razorpay — real payments, no fabricated payment status

## Getting started
```bash
npm install
cp .env.example .env.local   # fill in DATABASE_URL, GCP_PROJECT_ID, RAZORPAY keys
npm run db:push              # applies db/schema.sql to Cloud SQL
npm run dev
```

## Status
Day 1 scaffold — Jul 10, 2026. See `XPRIZE_RULES.md` for the 38-day build timeline.
