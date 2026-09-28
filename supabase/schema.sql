-- SHOPS -----------------------------------------------------------
create table shops (
  id text primary key,                     -- e.g. 'ABC001', shown in the URL
  owner_user_id uuid references auth.users(id) not null,
  name text not null,
  owner_name text,
  mobile text,
  email text,
  address text,
  logo_url text,
  is_active boolean default true,
  business_hours jsonb,                    -- { "mon": ["09:00","20:00"], ... }
  min_order_amount numeric default 0,
  file_size_limit_mb int default 20,
  accepted_file_types text[] default array['pdf','jpg','jpeg','png'],
  retention_hours int default 24,          -- hard-delete safety net
  services_enabled text[] default array['document','aadhaar','pan','photo','resume','xerox','custom'],
  agent_secret text not null,              -- baked into the agent ZIP, used to auth agent calls
  created_at timestamptz default now()
);

-- PRINTERS ----------------------------------------------------------
create table printers (
  id uuid primary key default gen_random_uuid(),
  shop_id text references shops(id) on delete cascade,
  name text not null,                      -- Windows printer name
  brand text,
  model text,
  capability text check (capability in ('bw','color','bw_color')) default 'bw_color',
  supports_duplex boolean default false,
  connection text,                         -- USB / Network
  is_auto_detected boolean default false,  -- reported by agent vs manually added
  is_online boolean default false,
  last_seen timestamptz,
  created_at timestamptz default now()
);

-- routing: which printer handles B&W jobs vs Color jobs
create table printer_routing (
  shop_id text primary key references shops(id) on delete cascade,
  bw_printer_id uuid references printers(id),
  color_printer_id uuid references printers(id),
  a3_printer_id uuid references printers(id)
);

-- PRICING -------------------------------------------------------------
create table pricing_rules (
  id uuid primary key default gen_random_uuid(),
  shop_id text references shops(id) on delete cascade,
  paper_size text not null,                -- A4, A3, ...
  color_mode text not null check (color_mode in ('bw','color')),
  price_per_page numeric not null,
  unique (shop_id, paper_size, color_mode)
);

-- ORDERS ----------------------------------------------------------------
create table orders (
  id uuid primary key default gen_random_uuid(),
  order_number text unique not null,       -- short human-friendly e.g. #1025
  shop_id text references shops(id) on delete cascade,
  customer_name text not null,
  mobile text not null,
  service_type text not null,              -- document, aadhaar, pan, photo, resume, xerox, custom
  print_settings jsonb not null,           -- {paper_size,color_mode,duplex,orientation,copies,page_range,aadhaar_mode}
  page_count int not null default 0,
  total_amount numeric not null default 0, -- informational, shown to customer, not charged online
  print_status text not null default 'queued'
     check (print_status in ('queued','sending_to_printer','printing','printed','failed','cancelled')),
  printer_id uuid references printers(id),
  print_job_id text unique not null,       -- idempotency key the agent checks before printing
  failure_reason text,
  created_at timestamptz default now(),
  expires_at timestamptz not null          -- created_at + shop.retention_hours
);

create table order_files (
  id uuid primary key default gen_random_uuid(),
  order_id uuid references orders(id) on delete cascade,
  file_name text not null,
  storage_path text not null,              -- path inside the private bucket
  page_count int default 1,
  sort_order int default 0,
  kind text default 'document'             -- document | aadhaar_front | aadhaar_back | aadhaar_composite
);

-- PRINT AGENTS --------------------------------------------------------
create table agent_status (
  shop_id text primary key references shops(id) on delete cascade,
  is_online boolean default false,
  last_heartbeat timestamptz,
  agent_version text
);
