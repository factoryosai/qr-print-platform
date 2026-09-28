-- Enable Row Level Security
alter table shops enable row level security;
alter table printers enable row level security;
alter table printer_routing enable row level security;
alter table pricing_rules enable row level security;
alter table orders enable row level security;
alter table order_files enable row level security;
alter table agent_status enable row level security;

-- Policies for shops
create policy "Shop owners can view their own shops"
  on shops for select
  using (owner_user_id = auth.uid());

create policy "Shop owners can update their own shops"
  on shops for update
  using (owner_user_id = auth.uid());

create policy "Shop owners can insert their own shops"
  on shops for insert
  with check (owner_user_id = auth.uid());

-- Policies for printers
create policy "Shop owners can view their printers"
  on printers for select
  using (shop_id in (select id from shops where owner_user_id = auth.uid()));

create policy "Shop owners can insert printers"
  on printers for insert
  with check (shop_id in (select id from shops where owner_user_id = auth.uid()));

create policy "Shop owners can update their printers"
  on printers for update
  using (shop_id in (select id from shops where owner_user_id = auth.uid()));

create policy "Shop owners can delete their printers"
  on printers for delete
  using (shop_id in (select id from shops where owner_user_id = auth.uid()));

-- Policies for printer_routing
create policy "Shop owners can manage printer routing"
  on printer_routing for all
  using (shop_id in (select id from shops where owner_user_id = auth.uid()));

-- Policies for pricing_rules
create policy "Shop owners can manage pricing rules"
  on pricing_rules for all
  using (shop_id in (select id from shops where owner_user_id = auth.uid()));

-- Policies for orders
create policy "Shop owners can view their orders"
  on orders for select
  using (shop_id in (select id from shops where owner_user_id = auth.uid()));

create policy "Shop owners can update their orders"
  on orders for update
  using (shop_id in (select id from shops where owner_user_id = auth.uid()));

-- Policies for order_files
create policy "Shop owners can view their order files"
  on order_files for select
  using (order_id in (
    select id from orders where shop_id in (
      select id from shops where owner_user_id = auth.uid()
    )
  ));

-- Policies for agent_status
create policy "Shop owners can view their agent status"
  on agent_status for select
  using (shop_id in (select id from shops where owner_user_id = auth.uid()));

-- Note: Customers and Print Agents interact via Next.js API routes using the 
-- service_role key, which bypasses RLS. These policies are strictly for 
-- authenticated shop owners using the Supabase client directly from the browser.
