-- Shared white-label control plane. One codebase serves many broker brands.
create table if not exists public.tenant_brand_profiles (
  tenant_id uuid primary key references public.organizations(id) on delete cascade,
  display_name text not null default '', logo_url text not null default '', favicon_url text not null default '',
  primary_color text not null default '#2f6e4f', secondary_color text not null default '#e6f1ea',
  surface_color text not null default '#fffefa', text_color text not null default '#18232b',
  font_body text not null default 'DM Sans', font_display text not null default 'Newsreader',
  hero_image_url text not null default '', tagline text not null default '', description text not null default '',
  whatsapp_number text not null default '', support_email text not null default '', city_label text not null default '',
  seo_title text not null default '', seo_description text not null default '', is_published boolean not null default false,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now(),
  constraint tenant_brand_profiles_primary_color_check check (primary_color ~ '^#[0-9A-Fa-f]{6}$'),
  constraint tenant_brand_profiles_secondary_color_check check (secondary_color ~ '^#[0-9A-Fa-f]{6}$'),
  constraint tenant_brand_profiles_surface_color_check check (surface_color ~ '^#[0-9A-Fa-f]{6}$'),
  constraint tenant_brand_profiles_text_color_check check (text_color ~ '^#[0-9A-Fa-f]{6}$')
);

create table if not exists public.tenant_domains (
  id bigint generated always as identity primary key,
  tenant_id uuid not null references public.organizations(id) on delete cascade,
  domain text not null unique, is_primary boolean not null default false,
  is_verified boolean not null default false, is_active boolean not null default true,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now(),
  constraint tenant_domains_domain_check check (domain = lower(btrim(domain)) and domain !~ '://')
);
create unique index if not exists tenant_domains_one_primary_per_tenant on public.tenant_domains(tenant_id) where is_primary;
create index if not exists tenant_domains_active_domain_idx on public.tenant_domains(domain) where is_active;

alter table public.tenant_brand_profiles enable row level security;
alter table public.tenant_domains enable row level security;
drop policy if exists tenant_brand_profiles_public_read on public.tenant_brand_profiles;
create policy tenant_brand_profiles_public_read on public.tenant_brand_profiles for select using (is_published = true);
drop policy if exists tenant_brand_profiles_tenant_read on public.tenant_brand_profiles;
create policy tenant_brand_profiles_tenant_read on public.tenant_brand_profiles for select using (public.is_super_admin() or tenant_id = any(select public.user_tenant_ids()));
drop policy if exists tenant_brand_profiles_tenant_write on public.tenant_brand_profiles;
create policy tenant_brand_profiles_tenant_write on public.tenant_brand_profiles for all using (public.is_super_admin() or tenant_id = any(select public.user_tenant_ids())) with check (public.is_super_admin() or tenant_id = any(select public.user_tenant_ids()));
drop policy if exists tenant_domains_public_read on public.tenant_domains;
create policy tenant_domains_public_read on public.tenant_domains for select using (is_active = true and exists (select 1 from public.tenant_brand_profiles p where p.tenant_id = tenant_domains.tenant_id and p.is_published = true));
drop policy if exists tenant_domains_tenant_read on public.tenant_domains;
create policy tenant_domains_tenant_read on public.tenant_domains for select using (public.is_super_admin() or tenant_id = any(select public.user_tenant_ids()));
drop policy if exists tenant_domains_tenant_write on public.tenant_domains;
create policy tenant_domains_tenant_write on public.tenant_domains for all using (public.is_super_admin() or tenant_id = any(select public.user_tenant_ids())) with check (public.is_super_admin() or tenant_id = any(select public.user_tenant_ids()));
