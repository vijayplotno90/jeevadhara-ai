-- Jeevadhara — Build with Gemini XPRIZE
-- Fresh schema, written for this hackathon. No tables or seed data copied
-- from the AWS H0 project. Cloud SQL for PostgreSQL.

-- === Identity ===
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  phone TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('farmer', 'consumer', 'provider', 'admin')),
  village TEXT,
  district TEXT DEFAULT 'Telangana',
  consent_share_with_judges BOOLEAN NOT NULL DEFAULT false, -- explicit consent per XPRIZE rules
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- === Marketplace ===
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  farmer_id UUID NOT NULL REFERENCES users(id),
  category TEXT NOT NULL CHECK (category IN ('produce','livestock','honey','nursery','tools','vehicles')),
  title TEXT NOT NULL,
  description TEXT,
  unit TEXT NOT NULL DEFAULT 'per kg',
  price NUMERIC(10,2) NOT NULL,
  price_source TEXT NOT NULL DEFAULT 'farmer_set' CHECK (price_source IN ('farmer_set','agent_recommended','agent_auto_applied')),
  stock_qty NUMERIC(10,2) NOT NULL DEFAULT 0,
  image_url TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  consumer_id UUID NOT NULL REFERENCES users(id),
  product_id UUID NOT NULL REFERENCES products(id),
  quantity NUMERIC(10,2) NOT NULL,
  total_amount NUMERIC(10,2) NOT NULL,
  -- Real payment status only — no hardcoded 'paid'. This must be set by a
  -- verified Razorpay webhook, never by the application defaulting it.
  payment_status TEXT NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending','paid','failed','refunded')),
  razorpay_order_id TEXT,
  razorpay_payment_id TEXT,
  -- Revenue attribution — required to be reported separately per the rules.
  is_related_party BOOLEAN NOT NULL DEFAULT false, -- team/family/pre-existing relationship
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- === AI evidence pipeline (build now, not retrofitted later) ===
CREATE TABLE agent_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_name TEXT NOT NULL CHECK (agent_name IN ('crop_advisory','listing_optimization','price_recommendation')),
  farmer_id UUID REFERENCES users(id),
  input JSONB NOT NULL,
  output JSONB NOT NULL,
  farmer_override BOOLEAN, -- null = n/a, true = farmer overrode AI decision, false = accepted as-is
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- === Financial evidence (required by rules, disclosed even if zero) ===
CREATE TABLE expenses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category TEXT NOT NULL, -- hosting, ai_api_usage, contractor, other
  description TEXT NOT NULL,
  amount_usd NUMERIC(10,2) NOT NULL,
  incurred_on DATE NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE marketing_spend (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  channel TEXT NOT NULL,
  amount_usd NUMERIC(10,2) NOT NULL DEFAULT 0,
  spent_on DATE NOT NULL,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE testimonials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id),
  order_id UUID REFERENCES orders(id),
  quote TEXT NOT NULL,
  consent_to_share BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- === Reference data ===
CREATE TABLE mandi_rates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  commodity TEXT NOT NULL,
  market TEXT NOT NULL,
  price_per_unit NUMERIC(10,2) NOT NULL,
  unit TEXT NOT NULL DEFAULT 'per quintal',
  rate_date DATE NOT NULL,
  source TEXT NOT NULL DEFAULT 'data.gov.in Agmarknet'
);

-- Helpful views for the /admin evidence dashboard (task #7 in the plan)
CREATE VIEW monthly_revenue AS
SELECT
  date_trunc('month', created_at) AS month,
  is_related_party,
  SUM(total_amount) FILTER (WHERE payment_status = 'paid') AS revenue_usd,
  COUNT(*) FILTER (WHERE payment_status = 'paid') AS paid_orders
FROM orders
GROUP BY 1, 2
ORDER BY 1;

CREATE VIEW agent_override_rate AS
SELECT
  agent_name,
  COUNT(*) AS total_decisions,
  COUNT(*) FILTER (WHERE farmer_override = true) AS overridden,
  ROUND(100.0 * COUNT(*) FILTER (WHERE farmer_override = true) / NULLIF(COUNT(*), 0), 1) AS override_pct
FROM agent_logs
WHERE farmer_override IS NOT NULL
GROUP BY agent_name;
