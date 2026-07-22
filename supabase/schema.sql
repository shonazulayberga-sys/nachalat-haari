-- ============================================================
-- נחלת הארי — סכמת Supabase  (נבדקה ע"י Codex)
-- הדביקו את כל הקובץ הזה ב-Supabase → SQL Editor → Run
-- ============================================================

-- קטגוריות
create table if not exists categories (
  id          text primary key,
  name        text not null,
  description text default '',
  image       text,
  sort        int  default 0,
  created_at  timestamptz default now()
);

-- מוצרים  (category חובה, ואי אפשר למחוק קטגוריה שיש בה מוצרים)
create table if not exists products (
  id                text primary key,
  name              text not null,
  description       text default '',
  category          text not null references categories(id) on delete restrict,
  images            jsonb not null default '[]'::jsonb
                      check (jsonb_typeof(images) = 'array'),
  material          text,
  blessing          text,
  personal_name     text,
  is_customer_order boolean not null default false,
  created_at        timestamptz default now()
);

create index if not exists products_category_idx on products(category);
create index if not exists products_customer_idx on products(is_customer_order);

-- תוכן הדפים (שורה אחת בלבד, JSON)
create table if not exists site_content (
  id   int primary key default 1 check (id = 1),
  data jsonb not null default '{}'::jsonb
);
insert into site_content (id, data) values (1, '{}'::jsonb)
  on conflict (id) do nothing;

-- ============================================================
-- הרשאות: קריאה פומבית, כתיבה רק עם מפתח service_role (השרת)
-- ============================================================
alter table categories   enable row level security;
alter table products     enable row level security;
alter table site_content enable row level security;

create policy "public read categories"  on categories   for select using (true);
create policy "public read products"     on products     for select using (true);
create policy "public read site_content" on site_content for select using (true);
-- אין policy לכתיבה → כתיבה אפשרית רק דרך service_role key (עוקף RLS) = רק מהניהול בשרת.

-- ============================================================
-- אחסון תמונות: צרו bucket פומבי בשם "products"
-- (Supabase → Storage → New bucket → name: products → Public: on)
-- אין policy כתיבה ל-anon → העלאות רק מהשרת עם service_role.
-- ============================================================
