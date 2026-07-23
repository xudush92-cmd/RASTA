# RASTA — mahsulot va texnik infratuzilma rejasi

> **Holat:** kanonik reja, v1.0  
> **Yo'nalish:** 3D/AR funksiyalarsiz; turli xil do'konlar va individual sotuvchilar bitta ilovada, lekin aniq ajratilgan.  
> **Biznes modeli:** RASTA katalog-marketplace. Xaridor va sotuvchi o'rtasidagi mahsulot to'lovi ilova ichida bajarilmaydi. Ilovadagi pullik operatsiyalar faqat RASTA xizmatlari — obuna va reklama — uchun ishlatiladi.

## 1. Mahsulot maqsadi

RASTA xaridorga kerakli mahsulotni, uning qaysi do'konda mavjudligini va sotuvchi haqidagi ishonchli ma'lumotni tez topishga yordam beradi. Do'kon egasiga esa bitta qulay kabinetdan vitrinasini, mahsulotlarini, variant va qoldiqlarini, xodimlarini, mijoz murojaatlarini va statistikani boshqarish imkonini beradi.

### Asosiy qiymat taklifi

- **Xaridor uchun:** mahsulotni qidirish → do'konni tekshirish → batafsil ma'lumotni ko'rish → sotuvchi bilan bog'lanish.
- **Do'kon uchun:** akkaunt ochish → do'konni tasdiqlash → mahsulotlarni tartibli joylash → qoldiq va murojaatlarni kuzatish → natijani o'lchash.
- **Individual sotuvchi uchun:** do'kon ochmasdan, alohida va aniq “Shaxsiy e'lon” sifatida mahsulot joylash.
- **Platforma uchun:** ishonchli katalog, moderatsiya, obuna va aniq belgilangan reklama xizmatlari.

### Mahsulot tamoyillari

1. Bitta ilova, lekin kontekstlar aralashmaydi: **Xaridor**, **Shaxsiy sotuvchi**, **Do'kon boshqaruvi**, **Admin**.
2. Do'kon mahsuloti va shaxsiy e'lon har bir kartada, filtrda va batafsil sahifada vizual ajratiladi.
3. Xaridor katalog va do'konlarni login qilmasdan ko'ra oladi; saqlash, chat va e'lon joylashda login so'raladi.
4. Har bir do'kon faqat o'z ma'lumotlarini ko'radi va boshqaradi.
5. “Tasdiqlangan” belgisi obuna sotib olingani uchun emas, tekshiruvdan o'tgani uchun beriladi.
6. Tezlik, xavfsizlik, tushunarlilik va mobil qulaylik yangi funksiyalar sonidan ustun.
7. 3D/AR mahsulot doirasiga kirmaydi.

## 2. MVP doirasi

### P0 — birinchi ishga tushirish uchun majburiy

- Telefon orqali OTP kirish, mehmon rejimi va sessiya boshqaruvi.
- Bitta foydalanuvchi profilidan xaridor/shaxsiy sotuvchi sifatida foydalanish.
- Do'kon yaratish, tekshiruvga yuborish va holatini ko'rish.
- Do'kon kontekstini tanlash va do'kon xodimlari rollari.
- Kategoriya va kategoriyaga mos dinamik mahsulot atributlari.
- Do'kon mahsuloti va shaxsiy e'lon yaratish, qoralama, oldindan ko'rish va moderatsiya.
- Rasm galereyasi, variant/SKU va oddiy qoldiq boshqaruvi.
- Bosh sahifa, kategoriya, qidiruv, filtr va saralash.
- Xaridor uchun to'liq do'kon vitrinasi va do'kon ichida qidiruv.
- Mahsulot batafsil sahifasi, sevimlilar, telefon va chat orqali murojaat.
- Do'kon dashboardi: ko'rish, saqlash, chat va telefon bosishlari.
- Asosiy admin panel: do'kon/e'lon moderatsiyasi, shikoyatlar, kategoriya va bloklash.
- Audit jurnali, monitoring, zaxira va tiklash jarayoni.

### P1 — pilotdan keyin

- Do'konda bir nechta filial va filial kesimida qoldiq.
- CSV/XLSX orqali ommaviy import va eksport.
- Kengaytirilgan aksiya/kampaniya boshqaruvi.
- Saqlangan qidiruv va narx/qoldiq bildirishnomalari.
- Sharh va reyting; “tasdiqlangan xarid” deyilmaydi, chunki checkout yo'q.
- Pullik obuna va reklama integratsiyasi.
- Kengaytirilgan analytics va hisobot eksporti.
- Ruscha, o'zbek kirill va qoraqalpoqcha lokalizatsiya.

### Hozircha doiradan tashqari

- Xaridor-sotuvchi mahsulot to'lovi, savat va checkout.
- Kuryer/yetkazib berish logistikasi.
- Buxgalteriya yoki to'liq POS/ERP.
- Mikroservislar.
- AI tavsiya va rasm orqali qidiruv.
- 3D model va AR.

## 3. Rollar va akkaunt modeli

### 3.1 Bitta foydalanuvchi — bir nechta kontekst

Foydalanuvchidan ro'yxatdan o'tishda “xaridor yoki sotuvchi” degan qaytmas tanlov so'ralmaydi. Har bir tasdiqlangan akkaunt:

- xaridor sifatida katalogni ko'rishi;
- shaxsiy e'lon joylashi;
- bir yoki bir nechta do'konga a'zo bo'lishi mumkin.

Ilovada **kontekst almashtirgich** bo'ladi:

- Shaxsiy profil;
- Mening shaxsiy e'lonlarim;
- “TexnoMart” do'koni;
- “UyMakon” do'koni.

Tanlangan kontekstga qarab menyu, ma'lumot va amallar o'zgaradi. Do'kon kontekstidagi har bir so'rovda `store_id` server tomonidan membership bilan tekshiriladi; faqat UI yashirishiga ishonilmaydi.

### 3.2 Do'kon ichidagi rollar

| Rol | Huquqlar |
|---|---|
| **Owner** | Barcha huquq, do'konni yopish, obuna, xodim va owner almashtirish |
| **Manager** | Profil, katalog, qoldiq, murojaat, kampaniya va analytics; owner/to'lov maxfiy sozlamalarisiz |
| **Catalog manager** | Mahsulot, variant, rasm, narx va qoldiq |
| **Support** | Chat/murojaatlar va ruxsat berilsa sharhlarga javob |
| **Analyst** | Faqat analytics va eksportni o'qish |

P0 da `Owner`, `Manager`, `Catalog manager`, `Support` yetarli. Huquqlar kodda alohida permissionlar sifatida saqlanadi; rol faqat permissionlar to'plami.

### 3.3 Platforma rollari

| Rol | Vazifa |
|---|---|
| **Moderator** | Do'kon, mahsulot va shikoyatlarni ko'rib chiqish |
| **Support agent** | Foydalanuvchi murojaati; maxfiy maydonlar maskalangan |
| **Admin** | Kategoriya, tarif, bloklash va platforma sozlamalari |
| **Super admin** | Adminlar va xavfli tizim amallari; MFA majburiy |

## 4. Do'konlar qanday ajratiladi

Barcha do'konlar bitta texnik yadrodan foydalanadi. Alohida ilovalar yaratilmaydi. Farq **do'kon turi**, **kategoriya daraxti** va **atribut shablonlari** orqali beriladi.

### Do'kon turi misollari

- Elektronika va maishiy texnika;
- Kiyim-kechak va poyabzal;
- Oziq-ovqat va kundalik mahsulotlar;
- Qurilish materiallari;
- Avto ehtiyot qismlar;
- Mebel va uy-ro'zg'or;
- Go'zallik va parvarish;
- Qishloq xo'jaligi mahsulotlari;
- Universal do'kon.

Do'kon bir nechta ruxsat etilgan kategoriyada ishlashi mumkin. Tur UI shablonini, tavsiya etilgan atributlarni va filtrlarni belgilaydi, lekin ma'lumotlarni boshqa do'konlardan ajratish uchun ishlatilmaydi — buning uchun `store_id` va membership mavjud.

### Dinamik atribut misollari

| Kategoriya | Majburiy atributlar | Ixtiyoriy atributlar |
|---|---|---|
| Telefon | brend, model, xotira, holat | rang, SIM, kafolat |
| Kiyim | jins/yosh, o'lcham, material | rang, mavsum |
| Oziq-ovqat | birlik, og'irlik/hajm, yaroqlilik | ishlab chiqaruvchi, tarkib |
| Qurilish | material/tur, o'lcham, birlik | marka, texnik standart |
| Avto ehtiyot qism | marka, model mosligi, detal kodi | yil oralig'i, ishlab chiqaruvchi |

Admin atribut ta'rifini boshqaradi. Sotuvchi faqat kategoriya uchun berilgan maydonlarni ko'radi. Shu yo'l bilan forma qisqa, aniq va turli do'konlarga mos bo'ladi.

## 5. Asosiy foydalanuvchi oqimlari

### 5.1 Xaridor

1. Til va hududni tanlaydi yoki mehmon sifatida bosh sahifaga kiradi.
2. Mahsulot yoki do'kon nomini qidiradi.
3. `Do'kon mahsuloti / Shaxsiy e'lon`, kategoriya, holat, narx va hudud bo'yicha filtrlaydi.
4. Mahsulot batafsil sahifasida rasm, narx, qoldiq holati, variantlar, atributlar, kafolat, yetkazib berish ma'lumoti va do'kon kartasini ko'radi.
5. Do'konga kirib uning ichida qidiradi, kategoriyalarini, mahsulotlarini va aloqa ma'lumotlarini ko'radi.
6. Mahsulotni saqlaydi yoki chat/telefon orqali sotuvchiga murojaat qiladi.
7. Shubhali e'lon, do'kon yoki chatni shikoyat qiladi/bloklaydi.

### 5.2 Do'kon egasi

1. Telefonni OTP bilan tasdiqlaydi.
2. “Do'kon ochish”ni tanlaydi va nom, tur, manzil, aloqa, ish vaqti, logo hamda hujjatlarni kiritadi.
3. Do'kon `draft`, so'ng `pending_verification` holatiga o'tadi.
4. Tasdiqlangach, do'kon vitrinasini oldindan ko'radi va e'lon qiladi.
5. Kategoriya tanlab mahsulot yaratadi; dinamik maydonlarni to'ldiradi, variant/SKU va qoldiq kiritadi.
6. Qoralamani ko'radi va moderatsiyaga yuboradi.
7. Faol mahsulotlar, qoldiq, kelgan murojaatlar va statistikani kuzatadi.
8. Zarur bo'lsa xodim taklif qiladi va cheklangan rol beradi.

### 5.3 Individual sotuvchi

1. Shaxsiy profil kontekstida “Shaxsiy e'lon” yaratadi.
2. Do'kon nomi, tasdiqlangan badge, xodim, variant/SKU va do'kon analyticsidan foydalana olmaydi.
3. Kartasi va batafsil sahifasi do'kon mahsulotidan aniq farq qiladi.
4. Shaxsiy e'lon limit va amal qilish muddatiga ega bo'ladi.

### 5.4 Moderator

1. Risk bo'yicha saralangan moderatsiya navbatini ko'radi.
2. Kontent, rasm, sotuvchi tarixi va takroriy e'lon signallarini tekshiradi.
3. Tasdiqlaydi, sabab kodi bilan rad etadi yoki qo'shimcha ma'lumot so'raydi.
4. Qaror audit jurnaliga yoziladi; sotuvchi apellyatsiya bera oladi.

## 6. Ekran va boshqaruv xaritasi

### Xaridor qismi

- Onboarding: til va hudud.
- Bosh sahifa: qidiruv, kategoriyalar, yaqin/tavsiya do'konlar, yangi mahsulotlar.
- Qidiruv: so'rov, autosuggest, tarix, filtr, saralash va bo'sh holat.
- Kategoriya va kichik kategoriya.
- Mahsulot kartasi va batafsil sahifa.
- Do'kon vitrinasi:
  - `Mahsulotlar`;
  - do'kon ichida qidiruv/filtr;
  - `Aksiyalar` (P1);
  - `Haqida`: manzil, filial, ish vaqti, aloqa, tekshiruv holati;
  - `Sharhlar` (P1).
- Sevimlilar: mahsulot, do'kon, saqlangan qidiruv.
- Chat va bildirishnomalar.
- Shaxsiy profil, maxfiylik, bloklanganlar va hisobni o'chirish.

### Do'kon boshqaruvi

- Kontekst/do'kon almashtirgich.
- Dashboard: bugungi muhim ko'rsatkich va ogohlantirishlar.
- Do'kon profilini boshqarish va xaridor ko'rinishida preview.
- Mahsulotlar:
  - qoralama;
  - tekshiruvda;
  - faol;
  - rad etilgan;
  - pauza;
  - qoldiq tugagan;
  - arxiv.
- Mahsulot yaratish/tahrirlash, media, variant va SKU.
- Qoldiq va qoldiq harakatlari.
- Murojaatlar: yangi, ochilgan, javob berilgan, yopilgan, spam.
- Xabarlar va tezkor javob shablonlari.
- Analytics: do'kon va mahsulot kesimida.
- Xodimlar va ruxsatlar.
- Tekshiruv va hujjatlar holati.
- Obuna/to'lovlar va reklama (P1).
- Audit tarixi va xavfsizlik sozlamalari.

### Admin web-panel

- Moderatsiya navbati va SLA.
- Do'kon/KYB tekshiruvlari.
- E'lon, do'kon, foydalanuvchi va chat shikoyatlari.
- Kategoriya, atribut va taqiqlangan mahsulot qoidalari.
- Foydalanuvchi/do'kon bloklash va apellyatsiya.
- Tarif va entitlementlar.
- Platforma ko'rsatkichlari va xavf signallari.
- Audit jurnali; xavfli amallar uchun sabab va qayta tasdiqlash.

## 7. Kontent va holat modellari

### 7.1 Do'kon holati

```text
draft -> pending_verification -> active
                    |             |  \
                    v             |   -> suspended -> active
                 rejected --------+   -> archived
```

- `rejected`: sabab va tuzatish yo'li ko'rsatiladi.
- `suspended`: xaridor uchun mahsulotlar yashiriladi, owner apellyatsiya holatini ko'radi.
- Owner do'konni bir zumda butunlay o'chirmaydi; avval `archived`, keyin retention siyosati ishlaydi.

### 7.2 Mahsulot/e'lon holati

```text
draft -> submitted -> under_review -> active
             |              |           | \
             |              v           |  -> paused -> active
             +----------> rejected       |  -> out_of_stock -> active
                                         -> expired -> archived
```

Xaridor faqat `active`, moderatsiyadan o'tgan va mavjudlik qoidalariga mos elementlarni ko'radi.

### 7.3 Obuna holati

`trial -> active -> grace_period -> past_due -> expired`, shuningdek `canceled`.

Obuna tugaganda do'kon ma'lumoti o'chmaydi. Yangi mahsulot joylash cheklanadi, mavjud vitrina grace-period davomida ko'rinadi. Aniq siyosat tarif ishga tushishidan oldin tasdiqlanadi.

### 7.4 Murojaat holati

`new -> opened -> replied -> closed`; alohida `spam` va `blocked`.

Bu **buyurtma emas**. RASTA sotuv yakunlanganini kafolatlamaydi va “daromad” hisoblamaydi. Analytics “murojaat”, “aloqa bosishi” va “murojaatga javob”ni o'lchaydi.

## 8. Ma'lumotlar modeli

Quyidagi jadvallar konseptual minimum. Har bir jadvalda `id`, `created_at`, `updated_at` va kerakli joyda soft-delete mavjud.

### Identifikatsiya va tenant

- `profiles` — ism, telefonning himoyalangan ko'rinishi, til, hudud.
- `devices_sessions` — sessiya, qurilma, revoke holati.
- `stores` — do'kon identiteti, turi, tavsif, status, verified_at.
- `store_memberships` — `store_id`, `user_id`, rol, permissionlar, status.
- `store_locations` — filial/manzil, geo nuqta, aloqa, ish vaqti.
- `store_verifications` — hujjat turi, tekshiruv holati, moderator va sabab.
- `staff_invitations` — muddatli va bir martalik taklif.

### Katalog

- `categories` — ierarxiya, slug, holat va tartib.
- `attribute_definitions` — nom, data type, unit, validatsiya.
- `category_attributes` — qaysi kategoriyada qaysi atribut majburiy.
- `listings` — umumiy qidiriladigan obyekt: `store_product` yoki `personal_listing`.
- `listing_attribute_values` — dinamik xususiyatlar.
- `listing_media` — rasm, tartib, o'lcham, moderation status.
- `product_variants` — rang/o'lcham kabi variant, SKU, narx override.
- `inventory_levels` — variant va filial kesimida mavjud son.
- `inventory_movements` — qoldiq o'zgarishining sababi, oldingi/yangi qiymat va kim o'zgartirgani; update DB tranzaksiyasi va optimistic version orqali atomik, idempotent va manfiy qoldiqsiz bajariladi.

`listings` uchun DB cheklovi:

```text
store_product    => store_id majburiy, personal_owner_id bo'sh
personal_listing => store_id bo'sh, personal_owner_id majburiy
```

`created_by` ikkala turda ham saqlanadi. Bu do'kon va shaxsiy egalikning aralashib ketishini DB darajasida to'xtatadi.

### Aloqa va ishonch

- `conversations`, `conversation_members`, `messages`.
- `contact_events` — telefon/chat/manzil bosilishi; maxfiy qiymatning o'zi emas.
- `favorites`, `store_follows`, `saved_searches`.
- `reports`, `blocks`, `moderation_cases`, `moderation_history`, `appeals`.
- `reviews` (P1) — sotib olingan deb belgilamasdan, interaction mavjudligini ko'rsatish mumkin.

### Platforma boshqaruvi

- `plans`, `plan_entitlements`, `subscriptions`, `subscription_payments`.
- `campaigns`, `sponsored_placements` (P1); reklama yorlig'i majburiy.
- `notifications`, `notification_preferences`.
- `audit_logs` — actor, tenant, action, target, before/after redacted diff, IP/device metadata.
- `outbox_events` — ishonchli asinxron vazifalar.
- `analytics_events`, `daily_store_metrics`, `daily_listing_metrics`.

### Muhim indekslar

- `listings(status, listing_type, category_id, region_id, published_at desc)`.
- `listings(store_id, status, updated_at desc)`.
- narx, holat va geo bo'yicha qisman indekslar.
- `store_memberships(user_id, status)` va unique `(store_id, user_id)`.
- `messages(conversation_id, created_at)`.
- qidiruv uchun normalized title/description va trigram/full-text indeks.

## 9. API va modul chegaralari

MVP **modular monolith** bo'ladi. Mikroservislar erta bosqichda kerak emas.

### Domen modullari

- `identity` — OTP, sessiya, profil.
- `stores` — do'kon, membership, filial, verification.
- `catalog` — kategoriya, atribut, listing, variant, media, qoldiq.
- `discovery` — qidiruv, filtr, ranking, tavsiya qilinadigan do'konlar.
- `messaging` — conversation, message, block.
- `trust-safety` — report, moderation, appeal, risk rules.
- `analytics` — event qabul qilish va agregatsiya.
- `billing` — RASTA obuna/reklama to'lovlari.
- `notifications` — in-app, push va SMS.
- `admin` — boshqaruv use-case'lari.

### API qoidalari

- Public o'qish endpointlari cache qilinadi; maxfiy maydonlar qaytarilmaydi.
- Har bir write server-side schema bilan validatsiya qilinadi.
- Do'kon write amallarida `store_id` + authenticated membership + permission tekshiriladi.
- Pagination cursor-based bo'ladi; katta ro'yxatlarda offset ishlatilmaydi.
- Har bir muhim write `idempotency_key` qabul qiladi.
- API xatolari yagona formatda: `code`, `message`, `field_errors`, `request_id`.
- API versiyasi `/api/v1`; breaking change yangi versiya talab qiladi.
- OpenAPI kontrakti implementation bilan birga yangilanadi.

## 10. Tavsiya etilgan texnik arxitektura

### 10.1 MVP stack

- **Xaridor va sotuvchi web/PWA:** Next.js + TypeScript, mobile-first.
- **Admin panel:** shu monorepodagi alohida Next.js app; public appdan alohida route/deploy va access policy.
- **UI:** Tailwind CSS + headless komponentlar + umumiy design-system package.
- **Auth/DB/Realtime:** Supabase managed PostgreSQL/Auth/Realtime — tez MVP uchun.
- **Server domain layer:** Next.js server route/handler yoki alohida yengil API service; privileged business write bevosita browserdan DBga yuborilmaydi.
- **DB:** PostgreSQL, geo uchun PostGIS.
- **Storage:** S3-compatible object storage/Supabase Storage + CDN.
- **Cache/rate-limit/job queue:** Redis; queue uchun BullMQ yoki managed ekvivalent.
- **Qidiruv P0:** PostgreSQL full-text + `pg_trgm` + normalized search field.
- **Qidiruv P1:** talab va hajm isbotlansa Typesense/Meilisearch/OpenSearch adapteri.
- **Observability:** error tracking, structured logs, metrics va uptime check.

Aniq framework versiyasi implementatsiya boshlanganda amaldagi barqaror/LTS versiyaga pin qilinadi. Versiya “latest”ga avtomatik suzmaydi.

### 10.2 Yuqori darajadagi oqim

```text
Browser/PWA
    |
    | HTTPS + CDN/WAF
    v
Next.js Web / Admin
    |
    | authenticated server API
    v
Domain modules / BFF
    |-------- PostgreSQL + RLS/PostGIS
    |-------- Object Storage + CDN
    |-------- Redis (cache/rate limit/queue)
    |-------- Realtime gateway
    |-------- Search adapter
    `-------- SMS / payment / push provider adapters
```

### 10.3 Nega modular monolith

- Bitta kichik jamoa tez va izchil ishlaydi.
- Bitta tranzaksiyada listing, audit va outbox yozish mumkin.
- Operatsion xarajat mikroservisdan ancha past.
- Modul chegaralari saqlansa, qidiruv yoki chatni keyin ajratish mumkin.

## 11. Qidiruv va discovery

### Qidiruv turlari

- Global mahsulot qidiruvi.
- Do'kon nomi qidiruvi.
- Faqat do'kon mahsuloti/faqat shaxsiy e'lon.
- Aniq bir do'kon ichida qidiruv.
- Kategoriya va dinamik atribut bo'yicha filtr.

### Normalizatsiya

- O'zbek lotin apostroflarining turli yozilishi (`o'`, `o‘`, `ў` transliteratsiya qoidalari).
- Lotin/kirill alias va sinonim lug'ati.
- Katta-kichik harf va diakritik normalizatsiya.
- Xatoga chidamlilik va prefix qidiruv.
- Brend/model/SKU exact matchga yuqori vazn.

### Ranking tamoyili

1. So'rovga moslik.
2. Moderatsiyadan o'tgan va faol holat.
3. Hudud/mavjudlik mosligi.
4. To'liq va sifatli listing.
5. Yangiligi va foydali engagement signallari.
6. Pullik joylashuv bo'lsa alohida “Reklama” belgisi.

Obuna yoki verified badge organik moslikni sun'iy ravishda bosib ketmaydi. Do'kon va shaxsiy tur rankingda ham saqlanadi.

## 12. Media pipeline

1. Client vaqtinchalik signed upload URL oladi.
2. MIME, extension va fayl signaturasi tekshiriladi.
3. Fayl hajmi va rasm o'lchami cheklanadi.
4. Malware scan va image decode bajariladi.
5. EXIF/GPS metama'lumotlari olib tashlanadi.
6. WebP/AVIF va thumbnail variantlar generatsiya qilinadi.
7. Moderatsiya holati yoziladi.
8. Faqat tayyor variant CDN orqali public ko'rsatiladi.

P0 da video va fayl yuborish o'chiriladi yoki qat'iy whitelist bilan cheklanadi.

## 13. Xavfsizlik modeli

### Identifikatsiya

- OTP telefon, IP va device fingerprint kesimida rate-limit qilinadi.
- “Raqam mavjud/mavjud emas”ni oshkor qilmaydigan bir xil javob.
- OTP qisqa muddatli, bir martalik va urinish limiti bilan.
- Sessiya rotatsiyasi, barcha qurilmalardan chiqish va shubhali login ogohlantirishi.
- Owner uchun tavsiya, admin/super-admin uchun majburiy MFA.

### Avtorizatsiya va tenant izolatsiyasi

- Default-deny RLS va server policy.
- Har bir store query membership bilan tekshiriladi.
- Support agent uchun PII maskalanadi.
- Adminning xavfli amali qayta tasdiqlash, sabab va audit talab qiladi.
- Xodim membershipi bekor qilinsa yoki permissioni pasaytirilsa, yangi API/write/realtime amallari darhol fail-closed; cache va faol sessiya ruxsati ko'pi bilan 60 soniyada yangilanadi.
- Owner authority faqat active `store_memberships(role=owner)` yozuvidan olinadi; har do'konda aynan bitta active owner DB invariant bilan kafolatlanadi.

### Ilova xavfsizligi

- OWASP ASVS Level 2 yo'nalishi.
- CSRF himoya, secure/httpOnly/sameSite cookie, qat'iy CORS va CSP.
- Server-side validation, output encoding va parametrli query.
- XSS, SSRF, IDOR, mass assignment va upload abuse uchun maxsus tekshiruv.
- Secretlar faqat secret manager/environment orqali; repo yoki browser bundle ichida emas.
- Dependency va container scanning CI ichida.
- Payment webhook: signature, timestamp, replay protection va idempotency.

### Maxfiylik

- Telefon public API da maskalangan; to'liq raqam faqat ruxsatli contact use-case orqali.
- Log, analytics va error trackingga OTP, token, hujjat yoki to'liq telefon yozilmaydi.
- Hujjatlar private bucketda, qisqa muddatli signed URL bilan.
- Consent, marketing opt-in, data export va hisobni o'chirish jarayoni.
- Retention jadvali: OTP/log/chat/audit/document uchun alohida muddat; qonuniy talab bilan yakuniy tasdiqlanadi.

## 14. Trust & Safety

P0 dan quyidagilar mavjud bo'ladi:

- taqiqlangan mahsulot va xizmatlar siyosati;
- matn va rasm moderatsiya navbati;
- shikoyat, bloklash va spam belgilash;
- bir xil rasm/telefon/matn asosida duplicate va risk signali;
- do'kon hujjat tekshiruvi;
- rad etish sabab kodlari va tuzatish yo'riqnomasi;
- apellyatsiya;
- moderator qarorlarining immutable audit izi;
- suspend qilingan do'kon/listingni direct URL, qidiruv indeksi va CDN cachedan ko'pi bilan 60 soniyada yashirish; purge ishlamasa origin authorization public ko'rsatishni rad etadi;
- navbat SLA va eskalatsiya.

Boshlang'ich maqsad: oddiy listing tekshiruvi 24 soat ichida, xavfli shikoyat darhol yuqori navbatga. Bu operatsion jamoa quvvatiga qarab tasdiqlanadi.

## 15. Tezlik va masshtablash

Boshlang'ich SLOlar:

| Ko'rsatkich | Maqsad |
|---|---|
| Public sahifa LCP p75 | mobil 4G da ≤ 2.5 s |
| Public read API p95 | ≤ 400 ms |
| Search p95 | ≤ 500 ms |
| Oddiy write API p95 | ≤ 800 ms, upload va tashqi provider vaqtisiz |
| Oylik mavjudlik | ≥ 99.9% |
| Server 5xx ulushi | < 1% |
| RPO | ≤ 15 daqiqa |
| RTO | ≤ 4 soat |

### Optimallashtirish

- Do'kon va mahsulot public sahifalari SSR/ISR va CDN cache.
- Responsive rasm, lazy loading va rasm o'lchamini oldindan belgilash.
- DB connection pooling, slow-query log va query budget.
- N+1 queryga yo'l qo'ymaslik.
- Qidiruv/filtr uchun composite va partial indeks.
- Og'ir analytics va rasm ishlovi queue orqali.
- Cache invalidation domain event/outbox orqali.
- Listing view count har requestda bitta hot rowni update qilmaydi; event yig'ilib agregatsiya qilinadi.

## 16. Ishonchlilik va operatsiya

### Muhitlar

- `local` — local stack va anonim demo data.
- `staging` — productionga o'xshash, alohida DB/storage/provider test credential.
- `production` — faqat tasdiqlangan release.

Production ma'lumoti stagingga xom holda ko'chirilmaydi.

### Deploy

- Pull request: lint, typecheck, unit/integration/security checks va preview.
- Main/release: migration dry-run, backup holati, staging smoke check.
- Production: backward-compatible migratsiya, health check, gradual rollout va tez rollback.
- Feature flag: to'lov, yangi qidiruv yoki katta funksiya uchun.

### Backup

- PostgreSQL daily backup + point-in-time recovery.
- Object storage versioning/lifecycle.
- Restore mashqi kamida har chorakda.
- Backup mavjudligi emas, real tiklash natijasi o'lchanadi.

### Observability

- Har request uchun `request_id`, user va tenant identifikatori faqat xavfsiz ID ko'rinishida.
- Structured log, error tracking, latency/error/rate metrics.
- Dashboard: auth, search, listing publish, chat, media, queue, DB, payment.
- Alert: 5xx, OTP abuse, queue backlog, DB saturation, search latency, backup failure.
- Runbook: provider uzilishi, DB overload, noto'g'ri moderatsiya, account takeover va data leak.

## 17. Analytics

### Xaridor funnel

`search_impression -> listing_view -> store_view -> favorite/contact_click -> chat_started`

### Do'kon funnel

`store_created -> verification_submitted -> store_approved -> first_listing_submitted -> first_listing_active -> first_contact`

### Do'kon dashboard ko'rsatkichlari

- Ko'rishlar va unique viewerlar.
- Qidiruv natijasida ko'rinish (impression).
- Sevimliga qo'shish.
- Telefon, chat va manzil bosishlari.
- Chatga birinchi javob va javob vaqti.
- Top mahsulotlar, natija bermagan mahsulotlar.
- Tugagan/kam qoldiq.
- Moderatsiyada/rad etilgan mahsulotlar.

Bir do'kon boshqa do'konning xom analytics ma'lumotini ko'rmaydi. Kichik segmentlarda maxfiylik uchun aggregation threshold ishlatiladi. “Sotuv” yoki “daromad” checkout bo'lmagani uchun hisoblanmaydi.

## 18. Dizayn tizimi va UX sifati

### Navigatsiya

- Xaridor rejimi: `Bosh sahifa`, `Qidiruv`, `Joylash`, `Xabarlar`, `Profil`.
- Do'kon boshqaruvi alohida dashboard shell ichida; xaridor navigatsiyasiga aralashmaydi.
- Profil yuqorisida do'kon/kontekst almashtirgich.
- Mobil qurilmada asosiy CTA kontentni yopmaydi; safe-area hisobga olinadi.

### Vizual ajratish

- Do'kon mahsuloti: do'kon nomi, verified holati, “Do'kon” labeli.
- Shaxsiy e'lon: “Shaxsiy” labeli va shaxs profili.
- Yangi/ishlatilgan alohida chip.
- Reklama organik natijadan “Reklama” labeli bilan ajratiladi.
- Status faqat rang bilan emas, matn va ikonka bilan ham ko'rsatiladi.

### Forma sifati

- Katta formalar qadamlarga bo'linadi: asosiy ma'lumot → kategoriya atributlari → variant/qoldiq → media → preview.
- Avtomatik qoralama va chiqishda yo'qotish ogohlantirishi.
- Inline validatsiya va xatoda aniq tuzatish ko'rsatmasi.
- Kategoriya tanlangach keraksiz maydon ko'rsatilmaydi.
- Owner xaridor ko'rinishini publishdan oldin ko'ra oladi.

### Accessibility va lokalizatsiya

- WCAG 2.2 AA maqsadi: kontrast, keyboard/focus, screen reader label va 44px touch target.
- Matnlar kod ichida tarqoq yozilmaydi; i18n katalogdan olinadi.
- O'zbek lotin P0; sana, telefon va UZS formatlari markaziy formatter orqali.
- Loading skeleton, empty, validation, offline, 403, 404, 429 va 500 holatlari dizayn qilinadi.

## 19. Monorepo tuzilishi

```text
rasta/
├── apps/
│   ├── web/                 # xaridor + shaxsiy profil + do'kon dashboard
│   ├── admin/               # moderator/admin web-panel
│   └── worker/              # queue, media, notification, aggregation
├── packages/
│   ├── ui/                  # design system
│   ├── domain/              # entity, policy va use-case kontraktlari
│   ├── database/            # schema, migrations, RLS, seed
│   ├── validation/          # umumiy schema
│   ├── i18n/                # tarjimalar va formatter
│   ├── observability/       # log/metrics/error helpers
│   └── config/              # lint/ts/build config
├── docs/
│   ├── architecture/
│   ├── api/
│   ├── runbooks/
│   └── decisions/           # ADRlar
└── infra/                   # deployment/IaC konfiguratsiyasi
```

Birinchi kod bosqichida hammasi birdan yaratilmaydi. Avval workspace, `web`, `admin`, `database`, `ui` va `validation` skeleti; keyin modullar vertikal kesimlarda to'ldiriladi.

## 20. Bosqichma-bosqich amalga oshirish

### 0-bosqich — qaror va dizayn poydevori

- Ushbu hujjatni source of truth sifatida tasdiqlash.
- P0/P1 chegarasi, do'kon tekshiruv hujjatlari va taqiqlangan tovar siyosatini yakunlash.
- 5–8 turdagi do'kon vakili bilan mahsulot joylash formasini tekshirish.
- Axborot arxitekturasi, design token, component inventory va interaktiv oqim.
- Threat model, permission matrix va data classification.

**Chiqish mezoni:** rol/permission, listing holatlari, ekran xaritasi va asosiy 5 oqimda ochiq qaror qolmagan.

### 1-bosqich — texnik poydevor

- Monorepo, CI, local/staging/prod konfiguratsiya.
- Auth, profile, session, audit va request ID.
- PostgreSQL schema, migrations, seed va default-deny RLS.
- Design system va public/dashboard/admin shell.
- Observability, feature flags, backup konfiguratsiyasi.

**Chiqish mezoni:** OTP flow, role policy va cross-tenant negative test stagingda o'tadi; backup yaratiladi va tiklash sinovi hujjatlashtiriladi.

### 2-bosqich — do'kon va katalog boshqaruvi

- Store creation, membership, invitation va verification.
- Kategoriya/atribut admin boshqaruvi.
- Listing wizard, qoralama, media pipeline, variant/SKU/qoldiq.
- Moderatsiya navbati, rad etish sababi va apellyatsiya.
- Storefront preview.

**Chiqish mezoni:** owner noldan do'kon yaratib, mahsulotni moderatsiyaga yuboradi; moderator tasdiqlaydi; mahsulot public vitrinada to'g'ri atributlar bilan ko'rinadi.

### 3-bosqich — xaridor discovery va storefront

- Bosh sahifa, kategoriyalar, global va do'kon ichidagi qidiruv.
- Filtr, saralash, pagination va URL holati.
- Mahsulot detail, do'kon profile, sevimlilar va ulashish.
- SEO metadata, sitemap va structured data.
- Performance budget va responsive/accessibility tekshiruvi.

**Chiqish mezoni:** mehmon mahsulotni global yoki do'kon ichida topa oladi; do'kon/shaxsiy tur hech qayerda aralashmaydi; p75 LCP va p95 search maqsadga yetadi.

### 4-bosqich — aloqa va xavfsizlik

- Chat, telefon/contact event, block/report.
- Notification preference va in-app notification.
- Rate limit, anti-spam, duplicate/risk signallari.
- Admin report queue va incident runbook.

**Chiqish mezoni:** xaridor mahsulotdan chat boshlaydi, do'kon supporti javob beradi, blok/shikoyat ishlaydi va barcha muhim harakatlar audit/eventga yoziladi.

### 5-bosqich — boshqaruv va analytics

- Do'kon dashboard, mahsulot va qoldiq ogohlantirishlari.
- Murojaat holati va javob vaqti.
- Kunlik store/listing aggregation.
- Xodim permission UI va sessiya boshqaruvi.
- CSV import/export (pilot talab qilsa P1).

**Chiqish mezoni:** owner ko'rsatkichlarni mahsulot va davr bo'yicha ko'radi; boshqa tenant ma'lumoti chiqmaydi; event va aggregate sonlari tekshiriladi.

### 6-bosqich — hardening va pilot

- P0 uchun vaqtli trial/manual entitlement va limit ko'rinishi; real payment gate yo'q.
- Load, security, accessibility va recovery sinovlari.
- Pilot do'konlarni onboarding qilish, support SLA va feedback loop.
- Monitoring alertlari va on-call/runbook mashqi.

**Chiqish mezoni:** P0 qabul mezonlari to'liq, kritik/yuqori security muammo yo'q, restore sinovi o'tgan, pilot foydalanuvchi asosiy oqimlarni yordamsiz tugatadi.

### P1 — muvaffaqiyatli pilotdan keyingi monetizatsiya

- Yakuniy tarif va entitlement matritsasi.
- Trial/grace/past_due/expired siyosati.
- Payment provider sandbox va production integratsiyasi.
- Signed/idempotent webhook, reconciliation va refund/support jarayoni.
- Aniq “Reklama” yorlig'iga ega sponsored placement.

**Chiqish mezoni:** do'kon ochish to'lovga bog'lanmagan holda obuna sotib olish/yangilash ishlaydi; webhook takror yuborilganda ikki marta entitlement bermaydi; to'lov uzilishi katalog ma'lumotini yo'qotmaydi.

## 21. Umumiy Definition of Done

Har bir funksiya “tayyor” hisoblanishi uchun:

- aniq acceptance criteria bajarilgan;
- loading, empty, error va permission-denied holatlari bor;
- mobil va desktop responsive;
- o'zbekcha matn va format to'g'ri;
- server-side validatsiya va permission tekshiruvi bor;
- audit/event kerak bo'lsa yoziladi;
- accessibility asosiy tekshiruvdan o'tgan;
- kuzatiladigan log/metric mavjud;
- migratsiya rollback/forward rejasi bor;
- foydalanuvchi hujjati yoki admin yo'riqnomasi yangilangan.

## 22. Ishga tushirish uchun yakuniy qabul mezonlari

1. Mehmon katalog, mahsulot va do'konni login qilmasdan ko'ra oladi.
2. Bir user shaxsiy profil va ruxsat berilgan do'kon kontekstlari orasida aniq almashadi.
3. Do'kon egasi do'konni yaratadi, tekshiruv holatini ko'radi va xodimga cheklangan rol beradi.
4. Mahsulot kategoriyaga mos majburiy atribut, media, variant/SKU va qoldiq bilan yaratiladi.
5. Mahsulot moderatsiyadan o'tmasdan public qidiruvga chiqmaydi.
6. Xaridor do'kon ichidagi mahsulotlarni kategoriya va qidiruv orqali ko'ra oladi.
7. Har bir natijada `Do'kon/Shaxsiy`, `Yangi/Ishlatilgan` va reklama holati aniq.
8. Chat, telefon bosishi, blok va shikoyat ishlaydi.
9. A do'konning `Owner`/`Manager`/`Catalog manager`/`Support` a'zosi B do'kon ma'lumotiga API yoki DB orqali kira olmaydi.
10. Admin va owner xavfli amallari audit jurnalida actor, vaqt va sabab bilan turadi.
11. OTP, upload, chat va public API abusega rate-limit qo'llangan.
12. PII loglarda yo'q, hujjat va maxfiy media private saqlanadi.
13. Search va public sahifalar belgilangan performance SLOga mos.
14. Production backupdan tiklash amalda sinovdan o'tgan.
15. 3D/AR uchun UI, schema, upload yoki tarif entitlement mavjud emas.
16. Membership bekor qilingach foydalanuvchining do'kon write/realtime kirishi darhol, cached permissioni ko'pi bilan 60 soniyada bekor bo'ladi.
17. Parallel qoldiq yangilanishi atomik/versionlangan, idempotent va manfiy qoldiq yaratmaydi; har o'zgarish inventory movementda izlanadi.
18. Suspend qilingan do'kon yoki listing direct URL, qidiruv va CDN orqali ko'pi bilan 60 soniyada ko'rinmay qoladi.

## 23. Ochiq biznes qarorlari

Kod boshlanishidan oldin quyidagilar egasi va sanasi bilan tasdiqlanadi:

- Bir user nechta do'kon ochishi mumkin?
- Do'konni tasdiqlash uchun qaysi hujjatlar va kim tekshiradi?
- P0 pilot qaysi hududlarda boshlanadi?
- Shaxsiy e'lon soni va muddati qancha?
- Tarif entitlementlari va grace-period aniq qanday?
- Qaysi tovar/xizmatlar taqiqlanadi yoki cheklanadi?
- Telefon login qilmagan foydalanuvchiga ko'rinadimi yoki faqat CTA bosilganda ochiladimi?
- Chat va moderatsiya ma'lumotlarining retention muddati qancha?
- Sharh yozish uchun minimal interaction signali nima?

Bu qarorlar qabul qilinmaguncha xavfli yoki qaytmas implementatsiya qilinmaydi; feature flag yoki konservativ default ishlatiladi.
