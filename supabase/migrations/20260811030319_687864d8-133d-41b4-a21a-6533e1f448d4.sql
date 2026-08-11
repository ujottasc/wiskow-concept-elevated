-- ============ roles & profiles ============
create type public.app_role as enum ('admin','user');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  full_name text,
  phone text,
  created_at timestamptz not null default now()
);
grant select, insert, update on public.profiles to authenticated;
grant all on public.profiles to service_role;
alter table public.profiles enable row level security;

create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  role public.app_role not null,
  unique (user_id, role)
);
grant select on public.user_roles to authenticated;
grant all on public.user_roles to service_role;
alter table public.user_roles enable row level security;

create or replace function public.has_role(_user_id uuid, _role public.app_role)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.user_roles where user_id = _user_id and role = _role)
$$;

create policy "own profile select" on public.profiles for select to authenticated using (auth.uid() = id or public.has_role(auth.uid(),'admin'));
create policy "own profile insert" on public.profiles for insert to authenticated with check (auth.uid() = id);
create policy "own profile update" on public.profiles for update to authenticated using (auth.uid() = id) with check (auth.uid() = id);
create policy "own roles select" on public.user_roles for select to authenticated using (auth.uid() = user_id or public.has_role(auth.uid(),'admin'));

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, coalesce(new.raw_user_meta_data->>'full_name', ''))
  on conflict (id) do nothing;

  insert into public.user_roles (user_id, role)
  values (new.id, case when lower(new.email) in ('arthur.contato9@gmail.com','mwiskowadmin@gmail.com')
                       then 'admin'::public.app_role else 'user'::public.app_role end)
  on conflict do nothing;
  return new;
end;
$$;
create trigger on_auth_user_created after insert on auth.users
for each row execute function public.handle_new_user();

-- ============ catalog ============
create table public.categories (
  id text primary key,
  name text not null,
  sort_order int not null default 0
);
grant select on public.categories to anon, authenticated;
grant insert, update, delete on public.categories to authenticated;
grant all on public.categories to service_role;
alter table public.categories enable row level security;
create policy "categories public read" on public.categories for select to anon, authenticated using (true);
create policy "categories admin write" on public.categories for all to authenticated using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));

create table public.collections (
  id text primary key,
  name text not null,
  description text not null default '',
  image text not null default '',
  featured boolean not null default false,
  sort_order int not null default 0
);
grant select on public.collections to anon, authenticated;
grant insert, update, delete on public.collections to authenticated;
grant all on public.collections to service_role;
alter table public.collections enable row level security;
create policy "collections public read" on public.collections for select to anon, authenticated using (true);
create policy "collections admin write" on public.collections for all to authenticated using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));

create table public.products (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  price numeric(10,2) not null default 0,
  category_id text references public.categories(id) on delete set null,
  collection_id text references public.collections(id) on delete set null,
  description text not null default '',
  images text[] not null default '{}',
  sizes text[] not null default '{}',
  colors text[] not null default '{}',
  featured boolean not null default false,
  is_new boolean not null default false,
  stock int not null default 0,
  active boolean not null default true,
  created_at timestamptz not null default now()
);
grant select on public.products to anon, authenticated;
grant insert, update, delete on public.products to authenticated;
grant all on public.products to service_role;
alter table public.products enable row level security;
create policy "products public read" on public.products for select to anon, authenticated using (true);
create policy "products admin write" on public.products for all to authenticated using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));

create table public.banners (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  subtitle text,
  image text not null,
  cta text,
  href text,
  sort_order int not null default 0,
  active boolean not null default true
);
grant select on public.banners to anon, authenticated;
grant insert, update, delete on public.banners to authenticated;
grant all on public.banners to service_role;
alter table public.banners enable row level security;
create policy "banners public read" on public.banners for select to anon, authenticated using (true);
create policy "banners admin write" on public.banners for all to authenticated using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));

create table public.coupons (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  discount int not null default 0,
  active boolean not null default true
);
grant select on public.coupons to anon, authenticated;
grant insert, update, delete on public.coupons to authenticated;
grant all on public.coupons to service_role;
alter table public.coupons enable row level security;
create policy "coupons public read" on public.coupons for select to anon, authenticated using (active = true or public.has_role(auth.uid(),'admin'));
create policy "coupons admin write" on public.coupons for all to authenticated using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));

create table public.site_settings (
  id boolean primary key default true,
  store_name text not null default 'Wiskow Concept',
  whatsapp text not null default '5551997593705',
  instagram text not null default 'wiskow.concept',
  logo text not null default '',
  primary_color text not null default '#fdb9e2',
  hero_banner_id uuid references public.banners(id) on delete set null,
  featured_collection_ids text[] not null default '{}',
  featured_product_ids text[] not null default '{}',
  constraint site_settings_singleton check (id)
);
grant select on public.site_settings to anon, authenticated;
grant insert, update on public.site_settings to authenticated;
grant all on public.site_settings to service_role;
alter table public.site_settings enable row level security;
create policy "settings public read" on public.site_settings for select to anon, authenticated using (true);
create policy "settings admin write" on public.site_settings for all to authenticated using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));

-- ============ favorites ============
create table public.favorites (
  user_id uuid not null references auth.users(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, product_id)
);
grant select, insert, delete on public.favorites to authenticated;
grant all on public.favorites to service_role;
alter table public.favorites enable row level security;
create policy "favorites own select" on public.favorites for select to authenticated using (auth.uid() = user_id);
create policy "favorites own insert" on public.favorites for insert to authenticated with check (auth.uid() = user_id);
create policy "favorites own delete" on public.favorites for delete to authenticated using (auth.uid() = user_id);

-- ============ orders ============
create table public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  customer_name text not null,
  customer_phone text not null,
  customer_email text,
  items jsonb not null default '[]'::jsonb,
  subtotal numeric(10,2) not null default 0,
  discount numeric(10,2) not null default 0,
  total numeric(10,2) not null default 0,
  coupon_code text,
  status text not null default 'Pendente',
  created_at timestamptz not null default now()
);
grant select, insert on public.orders to anon, authenticated;
grant update, delete on public.orders to authenticated;
grant all on public.orders to service_role;
alter table public.orders enable row level security;
create policy "orders insert guest" on public.orders for insert to anon with check (user_id is null);
create policy "orders insert auth" on public.orders for insert to authenticated with check (user_id is null or auth.uid() = user_id);
create policy "orders select own or admin" on public.orders for select to authenticated using (auth.uid() = user_id or public.has_role(auth.uid(),'admin'));
create policy "orders admin update" on public.orders for update to authenticated using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));
create policy "orders admin delete" on public.orders for delete to authenticated using (public.has_role(auth.uid(),'admin'));

-- ============ seed ============
insert into public.categories (id,name,sort_order) values
('blusas','Blusas',1),('bodies','Bodies',2),('conjuntos','Conjuntos',3),('vestidos','Vestidos',4),('calcas','Calças',5);
insert into public.collections (id,name,description,image,featured,sort_order) values
('segunda-pele','Segunda Pele','Malha canelada de alta compressão. O corte que acompanha o corpo sem apertar.','/__l5e/assets-v1/544f2cf6-de28-44ad-8cf9-82ca6df2ab14/wiskow-ig02.jpg',true,1),
('noite','Noite','Recortes, amarrações e couro. Peças pensadas para começar tarde.','/__l5e/assets-v1/203ecd7b-f6c0-4643-8109-542902ecee02/wiskow-ig19.jpg',true,2),
('denim','Denim','Modelagens amplas e lavagens profundas para o dia inteiro.','/__l5e/assets-v1/1bc4cdd1-506d-4c0b-9bf1-766bfcce76c7/wiskow-ig37.jpg',true,3),
('editorial','Editorial Neon','A cara da marca em luz rosa: atitude, brilho e corte preciso.','/__l5e/assets-v1/68857187-1ca2-40a9-b346-db7d2cbc95d7/wiskow-ig09.jpg',false,4);

insert into public.products (slug,name,price,category_id,collection_id,description,images,sizes,colors,featured,is_new,stock) values
('p1','Body Decote Transpassado',189,'bodies','segunda-pele','Body em malha canelada com decote transpassado e alças finas. Cavado nas laterais, acabamento em viés.',ARRAY['/__l5e/assets-v1/35bfda9f-fae8-43b7-bfc3-6353d494ff71/wiskow-ig01.jpg','/__l5e/assets-v1/da033676-1d50-4382-baf4-a8f8a94ddd62/wiskow-ig26.jpg']::text[],ARRAY['PP','P','M','G']::text[],ARRAY['Grafite','Preto']::text[],true,true,12),
('p2','Blusa Canelada Manga Longa',149,'blusas','segunda-pele','Blusa em canelado fino com decote quadrado e manga longa com passa-dedo. Caimento segunda pele.',ARRAY['/__l5e/assets-v1/544f2cf6-de28-44ad-8cf9-82ca6df2ab14/wiskow-ig02.jpg','/__l5e/assets-v1/047c3222-2abf-482e-9365-f5f88f47c611/wiskow-ig10.jpg','/__l5e/assets-v1/f3517f0f-f42f-42f4-9c8d-984777b4e480/wiskow-ig11.jpg','/__l5e/assets-v1/070c64ef-28b1-4f5b-9847-b0109af59c3a/wiskow-ig30.jpg']::text[],ARRAY['PP','P','M','G']::text[],ARRAY['Off White','Preto']::text[],true,true,18),
('p3','Cropped Tomara Que Caia',129,'blusas','denim','Cropped tomara que caia em malha estruturada com elástico interno. Fica no lugar o dia todo.',ARRAY['/__l5e/assets-v1/18628b8b-b5f5-4a16-aa0e-8f500bd26899/wiskow-ig03.jpg','/__l5e/assets-v1/2198b20b-3d59-4251-a16f-e561eeb917ce/wiskow-ig38.jpg']::text[],ARRAY['PP','P','M']::text[],ARRAY['Preto']::text[],false,false,10),
('p4','Body Recorte Cut-Out',199,'bodies','noite','Body preto com recorte frontal, alças cruzadas e costas fechadas. Peça-chave da noite.',ARRAY['/__l5e/assets-v1/129c40f2-c3c7-4bec-981b-daa823c1c452/wiskow-ig05.jpg','/__l5e/assets-v1/e9f07331-f9cc-465d-9152-decf7e3336be/wiskow-ig39.jpg']::text[],ARRAY['P','M','G']::text[],ARRAY['Preto']::text[],true,true,8),
('p5','Blusa Gola Alta Canelada',159,'blusas','segunda-pele','Gola alta em canelado com barra franzida e manga longa ajustada.',ARRAY['/__l5e/assets-v1/309da59a-5374-4cde-a84b-2981f68eebec/wiskow-ig06.jpg']::text[],ARRAY['P','M','G']::text[],ARRAY['Off White']::text[],false,false,14),
('p6','Blusa Ombro a Ombro',149,'blusas','noite','Ombro a ombro com manga longa e barra cropped. Malha com toque acetinado.',ARRAY['/__l5e/assets-v1/900bcc6f-0e37-47b6-982f-f06db387fa47/wiskow-ig07.jpg','/__l5e/assets-v1/45bbda19-0504-44c2-a3fd-d58c8748a704/wiskow-ig15.jpg']::text[],ARRAY['PP','P','M','G']::text[],ARRAY['Preto']::text[],true,false,11),
('p7','Blusa Decote Quadrado',149,'blusas','segunda-pele','Decote quadrado amplo, manga longa e modelagem justa. O básico que sustenta o look.',ARRAY['/__l5e/assets-v1/99136586-e9b9-4fa7-96d1-92b497e466e9/wiskow-ig08.jpg','/__l5e/assets-v1/85afaa4b-4d3d-4114-9405-cfda0f4585ac/wiskow-ig17.jpg']::text[],ARRAY['PP','P','M','G']::text[],ARRAY['Off White','Areia']::text[],false,false,16),
('p8','Top Renda Alça Fina',119,'blusas','segunda-pele','Top de alça fina com detalhe em renda no decote e na barra.',ARRAY['/__l5e/assets-v1/11dbee69-dc5e-4b20-9066-b4944919dfca/wiskow-ig14.jpg','/__l5e/assets-v1/47ff1d48-b284-48dc-a5d9-7bfdccfb1950/wiskow-ig41.jpg']::text[],ARRAY['PP','P','M']::text[],ARRAY['Preto']::text[],false,true,20),
('p9','Blusa Segunda Pele Chocolate',149,'blusas','segunda-pele','Malha lisa em tom chocolate, manga longa com passa-dedo e gola alta discreta.',ARRAY['/__l5e/assets-v1/0fd0dd91-626d-4a63-bcd8-75915d580d56/wiskow-ig12.jpg','/__l5e/assets-v1/d38163ab-8f8c-4213-ab17-5b74e0236720/wiskow-ig23.jpg','/__l5e/assets-v1/93b52116-74ef-45ab-9e5b-0428237bea17/wiskow-ig35.jpg']::text[],ARRAY['P','M','G']::text[],ARRAY['Chocolate']::text[],false,false,9),
('p10','Blusa Tachas Ombro Único',169,'blusas','noite','Assimétrica de ombro único com fileira de tachas metálicas.',ARRAY['/__l5e/assets-v1/b1e1be21-2fb6-4326-97be-bc5ae7208b03/wiskow-ig13.jpg']::text[],ARRAY['P','M','G']::text[],ARRAY['Off White']::text[],false,true,6),
('p11','Conjunto Cropped + Saia Off White',259,'conjuntos','segunda-pele','Conjunto em canelado: cropped manga longa e saia curta de cintura alta.',ARRAY['/__l5e/assets-v1/83b1c9f2-9bcb-4c15-af16-74b5338ed5b2/wiskow-ig16.jpg','/__l5e/assets-v1/04d19d97-8d72-44dc-8e1a-f971343cf011/wiskow-ig20.jpg']::text[],ARRAY['P','M','G']::text[],ARRAY['Off White']::text[],true,false,7),
('p12','Vestido Curto Gola Alta',229,'vestidos','noite','Vestido curto em malha grossa com gola alta, manga longa e costas fechadas.',ARRAY['/__l5e/assets-v1/203ecd7b-f6c0-4643-8109-542902ecee02/wiskow-ig19.jpg','/__l5e/assets-v1/cdecdb62-2648-4d12-b26b-a8f1e1fcffcd/wiskow-ig40.jpg']::text[],ARRAY['P','M','G']::text[],ARRAY['Preto']::text[],true,true,8),
('p13','Blusa Amarração nas Costas',159,'blusas','noite','Frente franzida com amarração e costas abertas com tiras. Fecha o look sem esforço.',ARRAY['/__l5e/assets-v1/ea12384d-c50e-4cb5-b6ba-5f55632dfb3c/wiskow-ig18.jpg','/__l5e/assets-v1/12ab8144-1e7f-46de-a871-1b0587efb9b7/wiskow-ig25.jpg']::text[],ARRAY['PP','P','M']::text[],ARRAY['Preto']::text[],false,false,10),
('p14','Vestido Longo Alça Fina',279,'vestidos','noite','Vestido longo em malha firme, alça fina e fenda lateral. Silhueta alongada.',ARRAY['/__l5e/assets-v1/e7c8b0c1-d173-46d7-b7a5-9384c1491db1/wiskow-ig32.jpg','/__l5e/assets-v1/e5c9aac4-a2cc-4b21-8dc4-111a5fcd809b/wiskow-ig29.jpg']::text[],ARRAY['P','M','G']::text[],ARRAY['Preto']::text[],false,false,5),
('p15','Conjunto Cut-Out Preto',269,'conjuntos','noite','Cropped com recortes vazados e saia curta de cintura alta. Conjunto para a noite.',ARRAY['/__l5e/assets-v1/a5b82635-a08d-46b3-97c3-a5901b96e8a3/wiskow-ig36.jpg','/__l5e/assets-v1/42237205-4284-436e-9336-efb004949593/wiskow-ig28.jpg']::text[],ARRAY['P','M']::text[],ARRAY['Preto']::text[],false,true,6),
('p16','Calça Couro Cintura Alta',249,'calcas','noite','Calça em couro ecológico com cintura alta e caimento reto.',ARRAY['/__l5e/assets-v1/65e11e6d-ef95-4ecd-9801-4627a13b7594/wiskow-ig31.jpg','/__l5e/assets-v1/289a46ca-297b-4714-a9a0-6ab45b9ce365/wiskow-ig34.jpg']::text[],ARRAY['36','38','40','42']::text[],ARRAY['Preto']::text[],true,false,9),
('p17','Calça Jeans Baggy Black',219,'calcas','denim','Jeans baggy em lavagem black, cintura alta e pernas amplas com barra larga.',ARRAY['/__l5e/assets-v1/1bc4cdd1-506d-4c0b-9bf1-766bfcce76c7/wiskow-ig37.jpg','/__l5e/assets-v1/2198b20b-3d59-4251-a16f-e561eeb917ce/wiskow-ig38.jpg']::text[],ARRAY['36','38','40','42']::text[],ARRAY['Black']::text[],false,true,12),
('p18','Blusa Manga Longa Grafite',139,'blusas','segunda-pele','Manga longa em malha grafite com decote quadrado e barra cropped.',ARRAY['/__l5e/assets-v1/682e8dbb-f972-4436-9363-2053e6299ee3/wiskow-ig22.jpg']::text[],ARRAY['PP','P','M','G']::text[],ARRAY['Grafite']::text[],false,false,15);

insert into public.banners (title,subtitle,image,cta,href,sort_order) values
('Segunda Pele','A malha que acompanha o corpo. Nova coleção Wiskow.','/__l5e/assets-v1/129c40f2-c3c7-4bec-981b-daa823c1c452/wiskow-ig05.jpg','Descobrir','/nova-colecao',1),
('Conjuntos','Um look inteiro em duas peças.','/__l5e/assets-v1/83b1c9f2-9bcb-4c15-af16-74b5338ed5b2/wiskow-ig16.jpg','Ver coleção','/colecoes',2),
('Editorial Neon','Atitude em luz rosa.','/__l5e/assets-v1/68857187-1ca2-40a9-b346-db7d2cbc95d7/wiskow-ig09.jpg','Ver catálogo','/catalogo',3);

insert into public.coupons (code,discount,active) values ('WISKOW10',10,true),('PRIMEIRA',15,true);

insert into public.site_settings (id, logo, hero_banner_id, featured_collection_ids, featured_product_ids)
values (true, '/__l5e/assets-v1/d19089d1-ca9c-47f7-8d3c-901d4ab93959/wiskow-wordmark.png',
 (select id from public.banners where sort_order = 1),
 ARRAY['segunda-pele','noite','denim']::text[],
 ARRAY['p2','p4','p12','p11']::text[]);