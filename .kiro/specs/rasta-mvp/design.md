# RASTA MVP — Texnik Dizayn (Design)

> **Kanonik manba:** [RASTA_INFRATUZILMA_REJASI.md](../../../RASTA_INFRATUZILMA_REJASI.md). Ushbu hujjatdagi soddalashtirilgan MVP detali kanonik rejaga zid bo'lsa, kanonik reja ustuvor va bu spec implementatsiyadan oldin yangilanadi.

## Umumiy ko'rinish

RASTA MVP — web ilova (Next.js), Supabase backend bilan. Maqsad: tez ishga tushirish, bepul jonli preview (Vercel) va kelajakda mobil (Flutter) ga kengaytirish imkoni.

## Texnologiya steki

| Qatlam | Texnologiya | Sabab |
|--------|-------------|-------|
| Frontend | **Next.js 14 (App Router) + TypeScript** | SEO, tez preview (Vercel), React ekotizimi |
| UI | **Tailwind CSS** + shadcn/ui | Tez, izchil dizayn tizimi (firuza/dark mode) |
| Backend/DB | **Supabase** (PostgreSQL) | Auth + DB + Storage + Realtime bir joyda, bepul tarif |
| Auth | Supabase Auth (telefon/OTP) | OTP qo'llab-quvvatlash |
| Fayl/rasm | Supabase Storage | Rasm yuklash, CDN |
| Realtime chat | Supabase Realtime | WebSocket asosida, qo'shimcha server kerak emas |
| Holat (state) | React Server Components + Zustand (mijoz) | Soddalik |
| Deploy | **Vercel** (frontend) + Supabase (cloud) | Bepul, avtomatik |

> Eslatma: Bu MVP tanlovi. Yuk oshganda backend NestJS/Go ga, qidiruv Meilisearch'ga ko'chiriladi (v2+).

## Arxitektura (yuqori daraja)

```
┌─────────────────────────────────────────────┐
│            Next.js (Vercel)                   │
│  - Server Components (SEO sahifalar)          │
│  - Client Components (chat, formalar)         │
│  - API Routes (kerakli joyda)                 │
└───────────────┬───────────────────────────────┘
                │  Supabase JS SDK
                ▼
┌─────────────────────────────────────────────┐
│                 Supabase                      │
│  Auth (OTP) │ PostgreSQL │ Storage │ Realtime │
│  Row Level Security (RLS) bilan himoyalangan  │
└─────────────────────────────────────────────┘
```

## Loyiha tuzilishi (papkalar)

```
rasta-web/
├── app/
│   ├── (auth)/login/              # OTP kirish
│   ├── (main)/
│   │   ├── page.tsx               # Bosh sahifa
│   │   ├── search/                # Qidiruv + filtr
│   │   ├── listing/[id]/          # Mahsulot/e'lon batafsil
│   │   ├── shop/[id]/             # Do'kon profili
│   │   ├── post/                  # Joylash (e'lon/do'kon)
│   │   ├── messages/              # Chat
│   │   ├── favorites/             # Sevimlilar
│   │   └── profile/               # Profil/Kabinet
│   ├── (dashboard)/dashboard/     # Do'kon boshqaruv paneli
│   └── layout.tsx
├── components/                    # UI komponentlar (Card, BottomNav...)
├── lib/                           # supabase client, utils
├── types/                         # TypeScript turlari
└── ...
```

## Ma'lumotlar bazasi (PostgreSQL / Supabase)

```sql
-- Foydalanuvchilar (Supabase auth.users bilan bog'liq profil)
profiles (
  id uuid PK references auth.users,
  phone text,
  name text,
  locale text default 'uz-Latn',
  created_at timestamptz
)

stores (
  id uuid PK,
  created_by uuid FK -> profiles,
  name text, logo_url text, banner_url text,
  description text, address text, region text,
  working_hours text, contact text,
  verified bool default false,
  rating numeric default 0,
  created_at timestamptz
)

store_memberships (
  id uuid PK,
  store_id uuid FK -> stores,
  user_id uuid FK -> profiles,
  role text,            -- 'owner' | 'manager' | 'catalog_manager' | 'support'
  permissions jsonb,
  status text,
  UNIQUE (store_id, user_id)
  -- Har bir store uchun aynan bitta active owner membership DB invariant bilan kafolatlanadi.
)

plans (
  id serial PK,
  name text,            -- 'Boshlang'ich' | 'Standart' | 'Premium'
  price int,            -- so'm/oy
  max_products int,
  features jsonb
)

subscriptions (
  id uuid PK,
  store_id uuid FK -> stores,
  plan_id int FK -> plans,
  status text,          -- 'active' | 'expired' | 'trial'
  start_at timestamptz, end_at timestamptz
)

categories (
  id serial PK, parent_id int, name text, icon text, slug text
)

attribute_definitions (
  id uuid PK, name text, data_type text, unit text, validation jsonb
)

category_attributes (
  category_id int FK -> categories,
  attribute_id uuid FK -> attribute_definitions,
  required bool default false
)

listings (
  id uuid PK,
  personal_owner_id uuid FK -> profiles NULL,
  created_by uuid FK -> profiles,
  store_id uuid FK -> stores NULL,
  type text,            -- 'personal_listing' | 'store_product'
  category_id int FK -> categories,
  title text, description text,
  price bigint, currency text default 'UZS',
  is_negotiable bool,
  condition text,       -- 'new' | 'used'
  region text,
  status text,          -- 'draft' | 'submitted' | 'under_review' | 'active' | 'rejected' | 'paused' | 'expired'
  views_count int default 0,
  expires_at timestamptz,
  created_at timestamptz
)

listing_images (
  id uuid PK, listing_id uuid FK, url text, position int
)

product_variants (
  id uuid PK, listing_id uuid FK, sku text, attributes jsonb, price bigint
)

inventory_levels (
  id uuid PK, variant_id uuid FK, store_location_id uuid, quantity int
)

favorites (
  id uuid PK, user_id uuid FK, listing_id uuid FK, created_at timestamptz
)

chats (
  id uuid PK, buyer_id uuid FK, seller_id uuid FK,
  listing_id uuid FK, created_at timestamptz
)

messages (
  id uuid PK, chat_id uuid FK, sender_id uuid FK,
  text text, is_read bool default false, created_at timestamptz
)

reports (
  id uuid PK, reporter_id uuid FK,
  target_type text,     -- 'listing' | 'store' | 'user' | 'chat'
  target_id uuid, reason text,
  status text default 'open', created_at timestamptz
)

events (   -- statistika uchun
  id bigserial PK, type text,   -- 'view' | 'contact' | 'favorite'
  listing_id uuid, store_id uuid, user_id uuid, created_at timestamptz
)
```

### Xavfsizlik (RLS — Row Level Security)
- `profiles`: foydalanuvchi faqat o'z profilini tahrirlaydi.
- `listings`: hamma faqat moderatsiyadan o'tgan faol listingni o'qiydi; shaxsiy e'lonni egasi, do'kon mahsulotini permissionli membership yaratadi/tahrirlaydi.
- `stores`: faqat tegishli permissionga ega faol `store_memberships` a'zosi tahrirlaydi; barcha store write so'rovlari `store_id` bo'yicha tenant tekshiruvdan o'tadi.
- `messages`/`chats`: faqat ishtirokchilar ko'radi.
- `favorites`: faqat egasi.

## Komponentlar (asosiy UI)

| Komponent | Vazifa |
|-----------|--------|
| `BottomNav` | Pastki 5 menyu (Bosh, Qidiruv, +, Xabarlar, Profil) |
| `ListingCard` | Mahsulot kartasi (rasm, narx, joylashuv, ❤) — izchil patern |
| `ShopCard` | Do'kon kartasi (logo, nom, reyting, ✔) |
| `SearchBar` | Qidiruv qatori |
| `FilterSheet` | Filtr paneli (bottom sheet) |
| `ImageGallery` | Rasm galereyasi (batafsil sahifa) |
| `ContactBar` | Yopishqoq "Xabar / Bog'lanish" panel |
| `ChatThread` | Chat oynasi (realtime) |
| `StatCard` | Statistika KPI kartasi (dashboard) |
| `PlanCard` | Tarif kartasi (obuna) |

## Dizayn tizimi (wireframe'lardan)

- **Asosiy rang:** firuza/yashil `#13A89E`
- **Aksent (CTA):** `#FF6B35` — faqat "Bog'lanish" va asosiy harakatlar
- **Dark mode** qo'llab-quvvatlanadi
- **Radius:** kartalar 16px, tugmalar 12px
- **Mobile-first:** barcha ekranlar telefonga moslangan

## Asosiy oqimlar (flows)

**E'lon joylash:** Login → Joylash (+) → tur tanlash (shaxsiy/do'kon) → forma → rasm yuklash → `draft` → `submitted` → `under_review` → moderator tasdig'idan keyin `active` → Mening e'lonlarim.

**Sotuvchiga bog'lanish:** Mahsulot sahifasi → "Xabar yozish" → (login tekshiruv) → chat yaratish/ochish → realtime xabarlar. Yoki "Bog'lanish" → telefon. Har ikkisi `events` ga `contact` yozadi (statistika).

**Do'kon ochish (P0):** Profil → "Do'kon oching" → do'kon ma'lumotlari → tekshiruv → trial/manual entitlement → Dashboard. Tarif va real to'lov do'kon ochishga gate emas.

**Obuna (P1):** Faol do'kon → Tariflar → RASTA xizmat to'lovi → signed/idempotent webhook → entitlement yangilanishi.

## Texnik qarorlar va asoslari

1. **Supabase** — alohida backend yozmasdan auth+DB+storage+realtime beradi; MVP tezligi uchun ideal.
2. **Next.js App Router** — SEO muhim (do'kon/mahsulot sahifalari Google'da topilishi kerak).
3. **RLS** — xavfsizlikni DB darajasida ta'minlaydi.
4. **events jadvali** — statistika uchun oddiy, kelajakda ClickHouse'ga ko'chiriladi.
5. **Pilot entitlement** — P0 da trial/manual entitlement; real Payme/Click/Uzum integratsiyasi faqat muvaffaqiyatli pilotdan keyingi P1 bosqichida.
