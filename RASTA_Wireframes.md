# RASTA — Asosiy Ekranlar Wireframe'lari (Matnli Maket)

> Onlayn bozor (katalog-marketplace), to'lovsiz model (faqat aloqa).
> Mobile-first · Dark mode · IKKI bo'lim: pulli **Do'kon** + bepul **E'lon**.

## Brending va Dizayn Tizimi (umumiy)

| Element | Qiymat | Izoh |
|---|---|---|
| Asosiy rang (Primary) | Firuza/Yashil `#13A89E` | Logotip, faol ikonka, sarlavhalar |
| Issiq aksent (CTA) | To'q sariq/marjon `#FF6B35` | Faqat **"Bog'lanish"** va asosiy harakat tugmalari |
| Fon (Dark mode) | `#0E1414` / `#16201F` | Asosiy fon + karta foni |
| Matn | `#F2F5F4` (asosiy) / `#8FA3A0` (ikkilamchi) | Kontrast WCAG AA |
| Radius | 16px kartalar, 12px tugmalar | Yumshoq, zamonaviy |

**Pastki navigatsiya (har doim 5 ta):**
`[ Bosh sahifa ] [ Qidiruv ] [ (+) Joylash ] [ Xabarlar ] [ Profil ]`
Markazdagi **(+)** firuza doira ichida — diqqat markazida.

---

## 1) Bosh Sahifa

```
+-------------------------------------------------+
| RASTA(logo)     Toshkent v          [🔔] [🌙]   |  <- header (firuza logo)
+-------------------------------------------------+
| [ 🔍  Mahsulot yoki do'kon qidiring...      ]   |  <- katta qidiruv input
+-------------------------------------------------+
| Kategoriyalar:                                  |
|  ( 📱 )  ( 👕 )  ( 🏠 )  ( 🚗 )  ( ⚽ )   >    |  <- gorizontal scroll
|  Texnika Kiyim  Uy   Avto  Sport               |
+-------------------------------------------------+
|  [   AKSIYA / BANNER  (firuza gradient)     ]   |  <- promo karusel ● ○ ○
+-------------------------------------------------+
| 🔥 Tavsiya etilgan do'konlar         Hammasi > |
|  +----------+  +----------+  +----------+       |
|  | [rasm]   |  | [rasm]   |  | [rasm]   |       |
|  | Do'kon A |  | Do'kon B |  | Do'kon C |       |
|  | ⭐4.8 ✔  |  | ⭐4.6    |  | ⭐4.9 ✔  |       |
|  +----------+  +----------+  +----------+       |
+-------------------------------------------------+
| Yangi e'lonlar                       Hammasi >  |
|  +---------------+   +---------------+          |
|  | [   rasm   ]  |   | [   rasm   ]  |          |  <- 2 ustunli grid
|  | Mahsulot nomi |   | Mahsulot nomi |          |
|  | 1 200 000 so'm|   | 850 000 so'm  |          |
|  | 📍 Chilonzor  |   | 📍 Yunusobod  |          |
|  | ❤            |   | ❤            |          |
|  +---------------+   +---------------+          |
+-------------------------------------------------+
| [🏠 Bosh] [🔍 Qid] [ (+) ] [💬 Xab] [👤 Prof]   |  <- pastki menyu
+-------------------------------------------------+
```

**Izoh:**
- **Yuqori panel:** chapda firuza logo, markazda shahar tanlash (`Toshkent v`), o'ngda bildirishnoma qo'ng'irog'i va dark/light almashtirgich.
- **Qidiruv** eng ko'zga tashlanadigan element — bir bosishda Qidiruv ekraniga o'tadi.
- **Kategoriyalar** gorizontal aylanadigan dumaloq ikonkalar (firuza ramka).
- **Banner karusel** — aksiya/Premium do'konlar reklamasi (firuza gradient fon).
- **Do'kon kartasi** kichik, gorizontal scroll; ✔ — tasdiqlangan/Premium belgisi.
- **Mahsulot kartasi (asosiy patern):** rasm → nom → **narx (firuza, qalin)** → joylashuv (📍) → ❤ saqlash. Narx eng kontrastli element.
- CTA bu ekranda yo'q — maqsad ko'rib chiqish va qidiruv.

---

## 2) Qidiruv Natijalari + Filtr

```
+-------------------------------------------------+
| <  [ 🔍 telefon                    ]   [⚙ Filtr]|  <- orqaga + input + filtr
+-------------------------------------------------+
| Saralash: [ Mosligi v ]   Ko'rinish: [▦] [≣]   |
| Faol filtrlar:  (Toshkent x) (1-3 mln x)        |  <- chiplar
+-------------------------------------------------+
| 248 ta natija                                   |
|  +---------------+   +---------------+          |
|  | [   rasm   ]  |   | [   rasm   ]  |          |
|  | Samsung A54   |   | iPhone 11     |          |
|  | 3 200 000 so'm|   | 4 100 000 so'm|          |
|  | 📍Toshkent ✔  |   | 📍Samarqand   |          |
|  | ❤            |   | ❤            |          |
|  +---------------+   +---------------+          |
|  +---------------+   +---------------+          |
|  | ...           |   | ...           |          |
|  +---------------+   +---------------+          |
+-------------------------------------------------+
| [🏠] [🔍] [ (+) ] [💬] [👤]                      |
+-------------------------------------------------+

   FILTR PANELI (pastdan ko'tariladi - bottom sheet):
   +---------------------------------------------+
   | ──                          Filtr      [X]  |
   | Kategoriya     [ Telefonlar         v ]     |
   | Narx           [ dan ___ ] [ gacha ___ ]    |
   | Hudud          [ Toshkent           v ]     |
   | Holati         (Yangi) (B/U)                |
   | Tur            (Do'kon) (E'lon)             |  <- ikki bo'lim filtri
   | Faqat tasdiqlangan ✔        [ o––  ]        |
   |---------------------------------------------|
   | [ Tozalash ]        [  Natijalarni ko'rish ]|  <- firuza CTA
   +---------------------------------------------+
```

**Izoh:**
- Yuqorida orqaga tugmasi, qidiruv so'zi tahrirlanadigan input, o'ngda **⚙ Filtr**.
- **Saralash** (Mosligi / Arzon / Qimmat / Yangi) va ko'rinish almashtirgich (grid ▦ / ro'yxat ≣).
- **Faol filtrlar** olib tashlanadigan chiplar ko'rinishida — foydalanuvchi nimani filtrlaganini ko'radi.
- **Filtr paneli** pastdan ochiladi (bottom sheet). Muhim: **Tur** filtri — pulli "Do'kon" yoki bepul "E'lon" tanlash imkoni (ilovaning ikki bo'limli modeliga mos).
- Pastdagi yagona firuza CTA — "Natijalarni ko'rish".

---

## 3) Mahsulot Batafsil Sahifasi  (Bog'lanish tugmasi bilan)

```
+-------------------------------------------------+
| <                                  [❤] [↗ Ulash]|
+-------------------------------------------------+
|  +-------------------------------------------+  |
|  |            [  MAHSULOT RASMI  ]           |  |  <- to'liq enli galereya
|  |                                  ● ○ ○ ○  |  |
|  +-------------------------------------------+  |
+-------------------------------------------------+
|  3 200 000 so'm                                 |  <- KATTA narx (firuza)
|  Samsung Galaxy A54 256GB                       |  <- mahsulot nomi
|  📍 Toshkent, Chilonzor · 2 soat oldin          |
|  Holati: Yangi · Ko'rishlar: 1 245              |
+-------------------------------------------------+
|  Tavsif                                         |
|  Lorem ipsum mahsulot haqida batafsil matn...   |
|  ...                                            |
+-------------------------------------------------+
|  Sotuvchi:                                      |
|  +-------------------------------------------+  |
|  | (avatar) "TexnoMart" ✔   ⭐4.8 (213)   >  |  |  <- do'kon profiliga link
|  +-------------------------------------------+  |
+-------------------------------------------------+
|  O'xshash mahsulotlar                           |
|  [karta] [karta] [karta]  >                     |
+-------------------------------------------------+
|  +-------------------+  +----------------------+ |
|  |  💬 Xabar yozish  |  | 📞 BOG'LANISH        | |  <- yopishqoq pastki panel
|  +-------------------+  +----------------------+ |     (o'ng tugma = issiq
+-------------------------------------------------+      aksent #FF6B35)
```

**Izoh:**
- **Rasm galereyasi** ekran enini to'liq egallaydi, swipe + nuqtali indikator.
- **Narx** — eng katta, firuza rang, qalin; nom undan keyin.
- Metama'lumot: joylashuv, vaqt, holat, ko'rishlar soni (ishonch signali).
- **Sotuvchi bloki** bosilsa → Do'kon profiliga o'tadi; ✔ va reyting ishonchni oshiradi.
- **Yopishqoq (sticky) pastki panel** — eng muhim qism:
  - Chapda neytral **"💬 Xabar yozish"** (ichki chat).
  - O'ngda **"📞 BOG'LANISH"** — issiq aksent rangda (#FF6B35), eng ko'zga tashlanadi. Bosilganda telefon qilish / chatga yo'naltirish (ilova oldi-sotdi qilmaydi, faqat bog'laydi).
- Pastki menyu bu ekranda CTA panel bilan almashtiriladi.

---

## 4) Do'kon Profili

```
+-------------------------------------------------+
| <        TexnoMart                  [↗] [⋮]     |
+-------------------------------------------------+
|  [        DO'KON MUQOVA RASMI (banner)       ]  |
|        (avatar)                                 |
|   TexnoMart ✔  (Premium)                        |  <- ✔ tasdiq + obuna belgisi
|   ⭐ 4.8 (213 sharh) · 📍 Toshkent              |
|   "Original texnika, kafolat bilan."            |
+-------------------------------------------------+
|  [  📞 Bog'lanish  ]  [ 💬 Xabar ] [+ Kuzatish] |  <- aksent + ikkilamchi
+-------------------------------------------------+
|  🕐 Ish vaqti 09:00–20:00   📍 Manzil/Xarita    |
+-------------------------------------------------+
|  Mahsulotlar (124)   |  Sharhlar  |  Haqida     |  <- tablar
|  ----------------    |            |             |
|  [ 🔍 Do'kon ichida qidirish        ]           |
|  +---------------+   +---------------+          |
|  | [  rasm  ]    |   | [  rasm  ]    |          |
|  | Mahsulot      |   | Mahsulot      |          |
|  | narx (firuza) |   | narx (firuza) |          |
|  +---------------+   +---------------+          |
|  ...                                            |
+-------------------------------------------------+
| [🏠] [🔍] [ (+) ] [💬] [👤]                      |
+-------------------------------------------------+
```

**Izoh:**
- **Muqova banner + avatar** — do'kon brendi. ✔ tasdiq belgisi va obuna darajasi (Premium/Standart) ko'rsatiladi.
- Reyting, sharhlar soni, joylashuv va qisqa slogan — ishonch bloki.
- Yuqorida **"📞 Bog'lanish"** (aksent), yonida "Xabar" va "+ Kuzatish".
- **Tablar:** Mahsulotlar / Sharhlar / Haqida. Do'kon ichida alohida qidiruv.
- Mahsulotlar 2 ustunli grid — bosh sahifadagi karta paterni bilan bir xil (izchillik).

---

## 5) Joylash Formasi  (markazdagi (+) tugmasidan)

```
+-------------------------------------------------+
|  Bekor qilish        Joylash        ( ? )       |
+-------------------------------------------------+
|  Qanday joylaysiz?                               |
|  +------------------+  +----------------------+  |
|  | 🏪 DO'KON        |  | 📢 BEPUL E'LON       |  |  <- ikki bo'lim tanlovi
|  | mahsuloti (obuna)|  | (Shaxsiy e'lon)      |  |
|  +------------------+  +----------------------+  |
+-------------------------------------------------+
|  Rasmlar (1/10)                                 |
|  [ + ] [img] [img] [img]                        |  <- birinchi rasm = muqova
+-------------------------------------------------+
|  Sarlavha                                       |
|  [ Masalan: Samsung A54 256GB           ]       |
|  Kategoriya     [ Tanlang             v ]       |
|  Narx           [ ____________ ] so'm           |
|                 [ ] Kelishiladi                 |
|  Holati         (Yangi)  (B/U)                  |
|  Hudud          [ Toshkent, Chilonzor v ]       |
|  Tavsif                                         |
|  [                                       ]      |
|  [   ko'p qatorli matn maydoni           ]      |
|  Aloqa          [ +998 90 123 45 67     ]       |
|                 [✔] Chat orqali ham bog'lanish  |
+-------------------------------------------------+
|  [  Oldindan ko'rish  ]   [   E'lonni joylash  ]|  <- firuza asosiy CTA
+-------------------------------------------------+
```

**Izoh:**
- Birinchi qadam — **bo'lim tanlash:** pulli "Do'kon mahsuloti" yoki "Bepul e'lon" (ilovaning yadro modeli shu yerda ajraladi). Tanlovga qarab keyingi maydonlar moslashadi.
- **Rasm yuklash** birinchi — vizual marketplace uchun eng muhim; birinchi rasm muqova bo'ladi.
- Majburiy maydonlar: sarlavha, kategoriya, narx (yoki "Kelishiladi"), holat, hudud.
- Aloqa raqami + chat orqali bog'lanish opsiyasi (to'lovsiz model — faqat aloqa).
- Pastda **"Oldindan ko'rish"** (ikkilamchi) va **"E'lonni joylash"** (firuza, asosiy CTA).

---

## 6) Do'kon Boshqaruv Dashboard  (statistika kartalari)

```
+-------------------------------------------------+
| TexnoMart Dashboard            [Premium ✔] [⚙]  |
+-------------------------------------------------+
|  Obuna: Premium · 18 kun qoldi   [ Uzaytirish ] |  <- obuna holati + CTA
+-------------------------------------------------+
|  Bu hafta                                       |
|  +----------------+   +----------------+        |
|  | 👁 Ko'rishlar  |   | 💬 Murojaatlar |        |
|  |   12 480       |   |    342         |        |  <- statistika kartalari
|  |   ▲ 12%        |   |   ▲ 8%         |        |
|  +----------------+   +----------------+        |
|  +----------------+   +----------------+        |
|  | 📞 Qo'ng'iroq  |   | ❤ Saqlanган    |        |
|  |   156          |   |   1 204        |        |
|  |   ▼ 3%         |   |   ▲ 20%        |        |
|  +----------------+   +----------------+        |
+-------------------------------------------------+
|  Ko'rishlar dinamikasi (7 kun)                  |
|  |                                  ▁▃▅▂▆▇▄     |  <- oddiy chart
|  +-------------------------------------------+  |
+-------------------------------------------------+
|  Mening mahsulotlarim (124)      [+ Qo'shish]   |
|  +-------------------------------------------+  |
|  | [img] Samsung A54   Faol ●   👁980  💬12  ⋮| |  <- har qatorda mini-stat
|  | [img] iPhone 11     Faol ●   👁640  💬5   ⋮| |
|  | [img] Quloqchin     Tugagan○ 👁120  💬0   ⋮| |
|  +-------------------------------------------+  |
+-------------------------------------------------+
|  [📊 Statistika] [📦 Mahsulot] [💬] [⚙ Sozlama] |  <- do'kon menyusi
+-------------------------------------------------+
```

**Izoh:**
- Faqat **pulli Do'kon** egalariga ko'rinadi. Yuqorida obuna darajasi va qolgan kun + "Uzaytirish" CTA (yagona to'lov nuqtasi — Payme/Click/Uzum).
- **4 ta KPI statistika kartasi:** Ko'rishlar, Murojaatlar (chat), Qo'ng'iroqlar, Saqlangan. Har birida o'sish/pasayish foizi (▲ yashil / ▼ qizil).
- **Dinamika grafigi** — soddа ustunli/chiziqli chart.
- **Mahsulotlar ro'yxati** har qatorda holat (Faol/Tugagan) + mini statistika + ⋮ menyu (tahrir/o'chir/boost).
- Bu ekranda alohida do'kon menyusi (pastki standart menyudan farqli).

---

## 7) Profil / Kabinet

```
+-------------------------------------------------+
|  Profil                                  [⚙]    |
+-------------------------------------------------+
|   (avatar)  Aziz Karimov                        |
|             +998 90 *** ** 67                   |
|             [ Profilni tahrirlash ]             |
+-------------------------------------------------+
|  +-------------------------------------------+  |
|  | 🏪  Mening do'konim          Premium ✔  > |  |  <- do'kon -> Dashboard
|  +-------------------------------------------+  |
|  | 📢  Mening e'lonlarim (8)               > |  |
|  | ❤  Saqlanganlar (24)                    > |  |
|  | 👁  Ko'rilganlar tarixi                  > |  |
|  +-------------------------------------------+  |
+-------------------------------------------------+
|  Sozlamalar                                     |
|  | 🌙  Dark mode               [ ●–– ] yoq    |
|  | 🌐  Til          O'zbek (lotin)         >  |  <- lotin/kirill/rus
|  | 🔔  Bildirishnomalar                    >  |
|  | 🛟  Yordam va qo'llab-quvvatlash         >  |
|  | ℹ  Ilova haqida                         >  |
|  +-------------------------------------------+  |
|  | 🚪  Chiqish                                |  <- qizil matn
+-------------------------------------------------+
| [🏠] [🔍] [ (+) ] [💬] [👤(faol)]               |
+-------------------------------------------------+
```

**Izoh:**
- Tepada foydalanuvchi avatar, ism, niqoblangan raqam va "Profilni tahrirlash".
- **"Mening do'konim"** — agar obuna bo'lsa Dashboard (ekran 6) ga, bo'lmasa do'kon ochish/obuna sahifasiga olib boradi (asosiy monetizatsiya yo'li).
- Bepul foydalanuvchi uchun "Mening e'lonlarim", "Saqlanganlar", "Tarix".
- **Sozlamalar:** dark mode tugmasi, til (lotin/kirill/rus — mahalliylashtirish), bildirishnoma, yordam.
- "Chiqish" — qizil ogohlantiruvchi matn.
- Pastki menyuda Profil ikonkasi faol (firuza).

---

## Umumiy Dizayn Prinsiplari (xulosa)

1. **Mahsulot kartasi izchil** — barcha ekranlarda bir xil patern: rasm → nom → narx(firuza) → joylashuv → ❤.
2. **Aksent rang faqat harakat uchun** — "Bog'lanish" va asosiy CTA'lar #FF6B35; qolgan UI firuza/yashil.
3. **Ikki bo'lim ajratilgan** — "Do'kon" (pulli) va "E'lon" (bepul) Joylash formasi va Filtrda aniq tanlanadi.
4. **To'lov yo'q** — barcha "Bog'lanish" tugmalari faqat chat/telefonga olib boradi; yagona to'lov — do'kon obunasi.
5. **Mobile-first + Dark mode** — barcha ekranlar bir qo'l bilan ishlatishga (yopishqoq pastki CTA va 5 menyu) moslangan.
