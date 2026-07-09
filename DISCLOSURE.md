# Pre-existing Work Disclosure

Required by the Build with Gemini XPRIZE rules ("New Projects Only") and FAQ.

## What is genuinely new for this hackathon (written after May 19, 2026, specifically for the
## Build with Gemini XPRIZE, Small Business Services category):
- All source code in this repository.
- Database schema (`db/schema.sql`) — new tables, including the AI evidence pipeline
  (`agent_logs`), financial evidence tables (`expenses`, `marketing_spend`), and the
  related-party vs. arms-length revenue split.
- The three Gemini/Vertex AI agents (crop advisory, listing optimization, price recommendation)
  and their logging integration.
- Real payment integration (Razorpay) — replacing any concept of a hardcoded payment status.

## What carries over from the team's prior work, and why it doesn't require code reuse:
- **Business concept and market knowledge**: a direct farmer-to-consumer marketplace, piloted
  in Solipeta village, Telangana, across produce/livestock/honey/nursery/tools/vehicles
  categories. This is domain knowledge and a business idea, not code — the rules govern reuse
  of code/templates, not reuse of a founder's own market research.
- **Brand direction**: farm green / gold / orange palette, Merriweather + Inter typography —
  recreated fresh in `tailwind.config.ts`, not copied from any file.
- **Public reference data**: the data.gov.in Agmarknet mandi-rate API (a public government API,
  not proprietary code) informs the price recommendation agent's context.

## What is explicitly NOT reused:
This team previously built an unrelated marketplace codebase for a different Devpost hackathon
(AWS "H0: Hack the Zero Stack", submitted June 30, 2026, using AWS Aurora/S3). None of that
project's code, database schema, seed data, or components are present in this repository. That
codebase is kept entirely separate, in a different local folder and a different (already
AWS-submitted) repo, and is not touched by this project.
