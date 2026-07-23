# Jeevadhara — Build with Gemini XPRIZE — Status

Last full audit: 2026-07-24 (24 days to deadline: Aug 17, 1:00 PM PT / Aug 18, 1:30 AM IST).
Verified against actual repo state (git log, file contents) and the live hackathon rules —
not assumed from memory. Superseded any older status notes.

---

## 1. Hard eligibility requirements — status

| Requirement | Status |
|---|---|
| Business newly operated, real customers/revenue, May 19–Aug 17 window | Not started — zero real transactions yet |
| Operated by AI agents executing real decisions | **At risk** — agents are written but not wired to any endpoint. See §3. |
| At least one Google Cloud product | Blocked — GCP billing account stuck (§4) |
| Gemini API call in deployed app | Code exists (`lib/gemini.ts`), not reachable from any route yet |
| Newly created after May 19, 2026, disclosed if reusing prior work | ✅ Done — `DISCLOSURE.md`, fresh repo, old AWS code isolated and never copied |
| Repo public or shared with testing@devpost.com + judging@hacker.fund | Repo is public (`github.com/vijayplotno90/jeevadhara-ai`). **Not yet confirmed** whether the two review addresses have been explicitly invited/notified — check before submission. |

No changes to the official rules since the last read-through (checked 2026-07-24) — deadline,
prize pool, and judging criteria all unchanged.

---

## 2. What's actually built (code that exists)

- Next.js 16 + React 19 app, builds clean, CVEs patched (Next core + sharp/libvips tracked as
  an accepted, currently-unreachable risk — see task list, must recheck before photo upload UI ships).
- DB schema (`db/schema.sql`) — not yet applied to any live database (Cloud SQL still blocked).
  Tables: `users` (with real bcrypt `password_hash`), `products`, `orders`, `agent_logs`,
  `expenses`, `marketing_spend`, `testimonials`, `mandi_rates`, plus `monthly_revenue` and
  `agent_override_rate` views for the future evidence dashboard.
- Three Gemini agent functions (`lib/gemini.ts`): crop advisory, listing optimization
  (multimodal), price recommendation. Each correctly logs to `agent_logs` via
  `lib/agentLog.ts`. **Not called from anywhere in the app yet.**
- Razorpay checkout (`/api/checkout`) + signature-verified webhook (`/api/webhooks/razorpay`).
  Real code, correctly never hardcodes `payment_status = 'paid'`. Can't be tested end-to-end
  without live Razorpay keys (KYC pending) and a live database (products table is empty/nonexistent
  until Cloud SQL exists).
- Real auth: phone + bcrypt password, JWT session cookie (`lib/auth.ts`), signup/login/logout/me
  routes, `/auth` page with role selection (farmer/consumer/provider) and judge-consent checkbox.
- Homepage (`/`) and marketplace (`/marketplace`) — both live on Vercel, currently showing
  **mock data** (`lib/mockProducts.ts`), not real listings.

## 3. What's missing — the actual remaining engineering work

Nothing here is blocked by GCP or Razorpay. All of it can be built now:

- **No product listing creation flow.** No page or API route lets a farmer create a `products`
  row. This is the single most important missing piece — without it, nothing downstream
  (pricing agent, listing agent, real marketplace data) has anything to operate on.
- **No route calls any of the three Gemini agents.** They need to be wired into the listing
  creation flow (price + listing optimization) and somewhere on the farmer/consumer side
  (crop advisory — likely a simple chat-style widget).
- **No farmer or consumer dashboard.** No order history, no "my listings," nothing role-specific
  beyond the login itself.
- **No `/admin` evidence dashboard.** The DB views (`monthly_revenue`, `agent_override_rate`)
  exist but nothing renders them. This is required submission evidence, not a nice-to-have.
- **No testimonial/consent capture flow** beyond the one checkbox at signup. The rules want
  testimonials tied to actual completed orders.
- **Cart/checkout UI** — `/api/checkout` exists but there's no page that calls it; a consumer
  currently cannot actually buy anything through the UI.

## 4. External accounts — status as of 2026-07-24

- **GCP (`jeevadhara-xprize` project):** billing account created but stuck on a prepayment
  requirement (India-specific fraud prevention), `billingEnabled: false` for two weeks running.
  This has not resolved passively — needs Vijay to actively complete the prepayment step.
  Blocks Cloud SQL provisioning and the Vertex AI service account's actual use (the service
  account and key were already created and work, just nothing to point them at yet without a
  DB, and Vertex AI itself doesn't strictly need billing-cleared for API calls the same way
  Cloud SQL does — worth testing the Gemini agents directly once code is wired, independent of
  the Cloud SQL blocker).
- **Razorpay:** signup + KYC submitted 2026-07-24 ~10:30am, went to video KYC step, under
  review. No action pending from Vijay right now.
- **Vercel:** deployed and live at a `.vercel.app` URL, auto-deploys on push to `main`. No
  environment variables set yet — `DATABASE_URL`, `GCP_SERVICE_ACCOUNT_JSON`, `GCP_PROJECT_ID`,
  `RAZORPAY_KEY_ID`/`SECRET`, `AUTH_SECRET` all still need to be added once the accounts clear.

## 5. Real-world traction (outside the codebase — genuinely the most valuable line item here)

Vijay reports actual farmers and consumers already identified/interested near Solipeta village,
independent of any code work. This is what the judging criteria actually weight most heavily
(Business Viability = real revenue/users) — more valuable than any UI polish. Priority should
bend toward getting these specific people transacting for real as soon as the pipeline exists,
not toward building every planned feature first.

## 6. Priority order for the remaining ~24 days

1. **Unblock GCP billing** (Vijay, active step required) and **Cloud SQL provisioning** —
   nothing with real data works until this clears.
2. **Product listing flow + wire the three agents in** — the actual missing engineering, doable
   right now regardless of GCP/Razorpay status (can build against a local/test DB or stub it).
3. **Cart/checkout UI** calling the already-built `/api/checkout`.
4. **Get Razorpay live keys in**, test one real transaction — ideally with one of Vijay's
   already-identified real farmers/consumers, not a synthetic test.
5. **`/admin` evidence dashboard** — surfaces `agent_logs`, revenue views, already half-built
   at the DB layer.
6. **Testimonial capture** on order completion.
7. **Expenses/marketing spend tracking** — weekly discipline, not a one-time build.
8. **Confirm testing@devpost.com / judging@hacker.fund have repo access.**
9. **Week of Aug 11–14:** demo video, 500–1000 word narrative, P&L.
10. **Submit with margin before Aug 17, 1:00 PM PT.**
