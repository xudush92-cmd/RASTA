# RASTA MVP — Vazifalar (Implementation Tasks)

> **Kanonik manba:** [RASTA_INFRATUZILMA_REJASI.md](../../../RASTA_INFRATUZILMA_REJASI.md). Batafsil bosqichlar, xavfsizlik mezonlari va yangi rol/tenant modeli shu hujjatda; ushbu atomik vazifalar kod boshlanishidan oldin unga moslab yangilanadi.
>
> Har bir vazifa kichik va tekshiriladigan. Vazifalar ketma-ket bajariladi. Har bir vazifa tugagach, siz natijani ko'rib tasdiqlaysiz, keyin keyingisiga o'tamiz.
> Belgilar: `[ ]` bajarilmagan · `[x]` bajarilgan

## Bosqich 0 — Loyiha poydevori

- [ ] 0.1 Next.js 14 + TypeScript loyihasini yaratish (`rasta-web/`), Tailwind CSS sozlash
  - shadcn/ui o'rnatish, dizayn tokenlari (firuza #13A89E, aksent #FF6B35), dark mode
  - _Talablar: 11_
- [ ] 0.2 Supabase loyihasini ulash (env, client), `lib/supabase.ts`
  - _Talablar: 1_
- [ ] 0.3 Asosiy layout + `BottomNav` (5 menyu) + sahifalar skeleti (bo'sh route'lar)
  - _Talablar: 11_

## Bosqich 1 — Ma'lumotlar bazasi

- [ ] 1.1 Migratsiya: identity/tenant, do'kon membershipi, kategoriya atributlari, listing/variant/qoldiq, chat, moderatsiya, audit va analytics jadvallari
  - _Talablar: 1-10_
- [ ] 1.2 RLS siyosatlari (har bir jadval uchun)
  - _Talablar: 1, 3, 6_
- [ ] 1.3 Boshlang'ich ma'lumot (seed): kategoriyalar, 3 ta tarif (plans), demo do'kon/e'lonlar
  - _Talablar: 4, 9_

## Bosqich 2 — Autentifikatsiya

- [ ] 2.1 OTP kirish ekrani (telefon kiritish → kod → tasdiqlash)
  - _Talablar: 1.1, 1.2, 1.3_
- [ ] 2.2 Birinchi kirishda profil to'ldirish (ism va lokal sozlamalar; qaytmas xaridor/sotuvchi roli yo'q)
  - _Talablar: 1.4_
- [ ] 2.3 Mehmon rejimi + himoyalangan amallar uchun login tekshiruvi
  - _Talablar: 1.5_

## Bosqich 3 — Katalog (ko'rish va qidiruv)

- [ ] 3.1 `ListingCard` va `ShopCard` komponentlari (izchil patern)
  - _Talablar: 4.4_
- [ ] 3.2 Bosh sahifa (kategoriyalar, tavsiyalar, yangi e'lonlar, do'konlar)
  - _Talablar: 4_
- [ ] 3.3 Qidiruv sahifasi + `FilterSheet` (kategoriya, narx, hudud, holat, tur) + saralash
  - _Talablar: 4.1, 4.2, 4.3, 4.5_
- [ ] 3.4 Mahsulot/e'lon batafsil sahifasi (galereya, narx, sotuvchi, ContactBar)
  - _Talablar: 5.1, 5.2_
- [ ] 3.5 Do'kon profili sahifasi (banner, mahsulotlar, tablar)
  - _Talablar: 3.3, 3.4_
- [ ] 3.6 Ko'rishlar sonini hisoblash (`events`: view)
  - _Talablar: 5.4, 8.3_

## Bosqich 4 — E'lon/mahsulot joylash

- [ ] 4.1 Joylash tur tanlash ekrani (bepul e'lon / do'kon mahsuloti)
  - _Talablar: 2.1, 3.2_
- [ ] 4.2 E'lon formasi + rasm yuklash (Supabase Storage), validatsiya
  - _Talablar: 2.1, 2.2, 2.3_
- [ ] 4.3 E'lon holatlari (`draft → submitted → under_review → active`; rejected/paused/expired) va "Mening e'lonlarim"; `active` faqat moderator tasdig'idan keyin
  - _Talablar: 2.4, 2.5, 2.6_

## Bosqich 5 — Sevimlilar

- [ ] 5.1 Sevimliga qo'shish/olib tashlash (❤) + sevimlilar sahifasi
  - _Talablar: 7.1, 7.2_

## Bosqich 6 — Chat (realtime)

- [ ] 6.1 Mahsulotdan chat boshlash + chat yaratish
  - _Talablar: 6.1, 6.5_
- [ ] 6.2 Chat oynasi (realtime xabarlar, Supabase Realtime)
  - _Talablar: 6.2_
- [ ] 6.3 Chatlar ro'yxati (oxirgi xabar, o'qilmagan)
  - _Talablar: 6.3_
- [ ] 6.4 Bog'lanish hodisasini yozish (`events`: contact)
  - _Talablar: 5.2, 8.1_

## Bosqich 7 — Do'kon va pilot entitlementi

- [ ] 7.1 Do'kon ochish, tekshiruv holati va membership formasi (nom, logo, banner, ma'lumot)
  - _Talablar: 3.1_
- [ ] 7.2 Pilot trial/manual entitlement va mahsulot limitini ko'rsatish; real to'lov P1
  - _Talablar: 9.1, 9.2_
- [ ] 7.3 Do'kon mahsuloti qo'shish (trial/manual entitlement limiti tekshiruvi)
  - _Talablar: 3.2, 3.5_

## Bosqich 8 — Do'kon boshqaruv paneli (statistika)

- [ ] 8.1 Dashboard: KPI kartalar (ko'rishlar, bog'lanishlar, sevimlilar)
  - _Talablar: 8.1, 8.2_
- [ ] 8.2 Mahsulotlar ro'yxati (har birida mini-statistika) + pilot entitlement holati
  - _Talablar: 8.3, 9.2_

## Bosqich 9 — Moderatsiya va yakuniy

- [ ] 9.1 Himoyalangan admin panel: do'kon/e'lon moderatsiyasi, shikoyat, bloklash, sabab va audit
  - _Talablar: 10_
- [ ] 9.2 Oddiy avto-tekshiruv (taqiqlangan so'zlar) — ixtiyoriy
  - _Talablar: 10.3_
- [ ] 9.3 Mahalliylashtirish: so'm format, +998 maska, hudud ro'yxati, til matnlari
  - _Talablar: 11_
- [ ] 9.4 Vercel'ga deploy va bepul jonli URL
  - _Talablar: barchasi (ko'rish uchun)_

---

## Ishlash tartibi
1. Men bir vazifani bajaraman → RASTA repoga push qilaman.
2. Siz Vercel/StackBlitz'da natijani ko'rasiz.
3. Tasdiqlaganingizdan keyin keyingi vazifaga o'taman.

## Eslatma
- To'lov (Payme/Click/Uzum) integratsiyasi muvaffaqiyatli pilotdan keyingi P1 bosqichida.
- Mobil (Flutter) versiyasi — web MVP tayyor bo'lgach.
