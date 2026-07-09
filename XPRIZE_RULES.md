# Build with Gemini XPRIZE — Rules & Compliance Checklist (Jeevadhara)

Source: xprize.devpost.com (rules, FAQ, overview, resources — read Jul 10, 2026).
Submission deadline: **Aug 17, 2026, 1:00 PM PT / Aug 18, 1:30 AM IST**.
Judging: Aug 18 – Sep 15, 2026. Winners: ~Sep 25, 2026. Prize pool: $2,000,000.

## Hard requirements (Stage 1, pass/fail)
- Business newly operated with real customers and real revenue during the Submission Period (May 19 – Aug 17, 2026).
- Business must be **operated by AI agents** — AI live in production executing key decisions, not a bolted-on chatbot.
- At least **one Google Cloud product** used. Vertex AI (Gemini) satisfies this directly.
- If the project has LLM functionality, at least one **Gemini API** call in the deployed app. (Confirmed via FAQ: both AI Studio API and Vertex AI count.)
- **Project must be newly created after the Submission Period started.** Reuse of pre-existing **generic** templates, frameworks, boilerplates, or code snippets is allowed and must be disclosed. Reuse of a fully-built prior project (e.g. this team's earlier AWS H0 hackathon marketplace) does **not** qualify as "generic" — that is why this codebase is written fresh, not ported. See `DISCLOSURE.md`.
- Repo public (with licensing) or private and shared with **testing@devpost.com** and **judging@hacker.fund**.

## Our category
**Small Business Services** — "Powering everyday businesses with tools to compete and win."
Jeevadhara: AI-operated marketplace + advisory platform for smallholder farmers, pilot in Solipeta village, Telangana. AI agents run pricing, listing optimization, and crop advisory; farmers and consumers transact for real money via Razorpay.

## Submission checklist
- [ ] GitHub repo public, real source code pushed (this repo, not the old AWS one)
- [ ] Category: Small Business Services
- [ ] Text description: AI-native operation + explicit disclosure of what's pre-existing knowledge (brand, pilot village, category list) vs. all-new code
- [ ] Demo video < 3 min, public on YouTube/Vimeo/Youku — shows agents deciding live + a real payment completing, states Gemini + Google Cloud product used
- [ ] 500–1000 word written narrative: AI vs. human division of labor, jobs/economic opportunity created, build story
- [ ] Revenue evidence: total revenue, revenue by month (May/Jun/Jul/Aug — May/Jun will legitimately be $0), total costs + one-line description, marketing/CAC spend (even if $0)
- [ ] Related-party revenue disclosed **separately** from arms-length revenue
- [ ] User evidence: real user count + breakdown, testimonials, explicit consent to share
- [ ] Product evidence: agent execution logs, API usage records, dashboard screenshots
- [ ] P&L using Devpost's provided template
- [ ] Testing access: public URL kept live through Sep 15

## Judging criteria (equally weighted)
1. Business Viability — real revenue, real users, sustainable model
2. AI-Native Operations — AI live in production, executing key decisions
3. Category Impact — meaningful movement in Small Business Services

## Non-negotiables
1. No fabricated `payment_status`. Every "paid" order is Razorpay-verified via webhook. See `db/schema.sql` — default is `pending`, never `paid`.
2. Every agent decision that matters is logged to `agent_logs` (input, output, timestamp, farmer_override) — required evidence, not telemetry nicety.
3. Track expenses and marketing spend weekly from day one, in `expenses` / `marketing_spend` tables — do not retrofit at the end.
4. Submit well before Aug 17, 1:00 PM PT.

## Timeline (today: Jul 10, 2026 — 38 days to deadline)
- **Now – Jul 16**: GCP project + Vertex AI enabled, Cloud SQL provisioned, Razorpay KYC started, agents wired end-to-end, first 5–10 real pilot users lined up (Solipeta farm + neighbors).
- **Jul 17 – Jul 31**: Real transactions flowing, `/admin` evidence dashboard live, testimonials + consent capture on order completion.
- **Aug 1 – Aug 10**: Consistent weekly real revenue, expense/marketing tracking current, P&L drafted.
- **Aug 11 – Aug 14**: Record 3-minute demo video, write 500–1000 word narrative.
- **Aug 15 – Aug 17**: Final QA, submit with margin — Devpost locks submissions at the deadline.
