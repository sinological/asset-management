CREATE TABLE IF NOT EXISTS assets (
  id BIGSERIAL PRIMARY KEY,
  asset_no VARCHAR(100) UNIQUE NOT NULL,
  name VARCHAR(255),
  model VARCHAR(255),
  serial_number VARCHAR(255),
  purchase_date DATE,
  location VARCHAR(255),
  owner VARCHAR(255),
  department VARCHAR(255),
  price NUMERIC(12,2),
  status VARCHAR(50),
  photo_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_asset_no ON assets(asset_no);
CREATE INDEX IF NOT EXISTS idx_owner ON assets(owner);
