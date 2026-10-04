CREATE TABLE IF NOT EXISTS admin_users (
  id BIGSERIAL PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  last_login_at TIMESTAMPTZ,
  disabled_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS quote_requests (
  id BIGSERIAL PRIMARY KEY,
  public_id TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  origin TEXT NOT NULL,
  destination TEXT NOT NULL,
  service TEXT NOT NULL,
  cargo TEXT NOT NULL DEFAULT '',
  notes TEXT NOT NULL DEFAULT '',
  consent_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'quoted', 'closed')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS quote_requests_created_idx ON quote_requests (created_at DESC);
CREATE INDEX IF NOT EXISTS quote_requests_status_idx ON quote_requests (status, created_at DESC);

CREATE TABLE IF NOT EXISTS shipments (
  id BIGSERIAL PRIMARY KEY,
  tracking_code TEXT NOT NULL UNIQUE,
  quote_request_id BIGINT REFERENCES quote_requests(id) ON DELETE SET NULL,
  reference TEXT NOT NULL,
  origin TEXT NOT NULL,
  destination TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'created' CHECK (status IN ('created', 'collected', 'in_transit', 'out_for_delivery', 'delivered', 'delayed', 'cancelled')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS tracking_events (
  id BIGSERIAL PRIMARY KEY,
  shipment_id BIGINT NOT NULL REFERENCES shipments(id) ON DELETE CASCADE,
  status TEXT NOT NULL CHECK (status IN ('created', 'collected', 'in_transit', 'out_for_delivery', 'delivered', 'delayed', 'cancelled')),
  location TEXT NOT NULL DEFAULT '',
  description TEXT NOT NULL,
  event_time TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by BIGINT REFERENCES admin_users(id) ON DELETE SET NULL
);
CREATE INDEX IF NOT EXISTS tracking_events_shipment_idx ON tracking_events (shipment_id, event_time DESC);
