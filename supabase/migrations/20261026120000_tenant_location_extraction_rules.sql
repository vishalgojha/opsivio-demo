-- Tenant-owned deterministic locality rules.
-- Rules can only annotate a parsed record when their regex matches the exact
-- raw WhatsApp source text for that tenant. They never create inventory.

create table if not exists public.location_extraction_rules (
  id bigint primary key generated always as identity,
  tenant_id uuid not null references public.organizations(id) on delete cascade,
  name text not null,
  pattern text not null,
  canonical_location text not null,
  is_active boolean not null default true,
  priority integer not null default 100,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint location_extraction_rules_name_check check (char_length(btrim(name)) between 1 and 120),
  constraint location_extraction_rules_pattern_check check (char_length(btrim(pattern)) between 1 and 500),
  constraint location_extraction_rules_location_check check (char_length(btrim(canonical_location)) between 1 and 160),
  constraint location_extraction_rules_priority_check check (priority between 0 and 10000),
  constraint location_extraction_rules_tenant_name_unique unique (tenant_id, name)
);

create index if not exists idx_location_extraction_rules_tenant_active_priority
  on public.location_extraction_rules(tenant_id, is_active, priority desc, id asc);

alter table public.location_extraction_rules enable row level security;

drop policy if exists "tenant_select_location_extraction_rules" on public.location_extraction_rules;
create policy "tenant_select_location_extraction_rules" on public.location_extraction_rules
  for select using (public.is_super_admin() or tenant_id = any(select public.user_tenant_ids()));

drop policy if exists "tenant_insert_location_extraction_rules" on public.location_extraction_rules;
create policy "tenant_insert_location_extraction_rules" on public.location_extraction_rules
  for insert with check (public.is_super_admin() or tenant_id = any(select public.user_tenant_ids()));

drop policy if exists "tenant_update_location_extraction_rules" on public.location_extraction_rules;
create policy "tenant_update_location_extraction_rules" on public.location_extraction_rules
  for update using (public.is_super_admin() or tenant_id = any(select public.user_tenant_ids()))
  with check (public.is_super_admin() or tenant_id = any(select public.user_tenant_ids()));

drop policy if exists "tenant_delete_location_extraction_rules" on public.location_extraction_rules;
create policy "tenant_delete_location_extraction_rules" on public.location_extraction_rules
  for delete using (public.is_super_admin() or tenant_id = any(select public.user_tenant_ids()));
