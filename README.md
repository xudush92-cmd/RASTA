# RASTA

Butun O'zbekiston uchun **onlayn bozor (katalog-marketplace)** ilovasi.

Bozorlar, supermarketlar va barcha turdagi sotuvchilar o'z do'konlarini ochib, mahsulotlarini joylaydi. Xaridor mahsulotni qidirib topadi, do'konga boradi yoki sotuvchi bilan bog'lanadi.

> **Asosiy tamoyil:** ilova ichida oldi-sotdi (to'lov) amalga oshirilmaydi. Ilova katalog, do'kon profillari, qidiruv va aloqa vazifasini bajaradi.

## Hujjatlar

- **[RASTA_Loyiha_Rejasi_v2.pdf](./RASTA_Loyiha_Rejasi_v2.pdf)** ⭐ — to'liq reja (v2). To'rt mutaxassis (UI/UX dizayn, mahsulot menejmenti, tizim arxitekturasi, xavfsizlik) tahlili asosida: navigatsiya/menyular, obuna tariflari, do'kon boshqaruv paneli, statistika, texnologiya steki, integratsiyalar, ma'lumotlar bazasi, Trust & Safety, mahalliylashtirish va yo'l xaritasi.
- [Uzbekiston_Onlayn_Bozor_Loyiha_Rejasi.pdf](./Uzbekiston_Onlayn_Bozor_Loyiha_Rejasi.pdf) — birinchi versiya (v1).
- `build_pdf.py` / `build_pdf_v2.py` — PDF'larni qayta yaratuvchi skriptlar (sof Python, tashqi kutubxonasiz).

### Dizayn va menyular

- **[RASTA_Ekran_Xaritasi.md](./RASTA_Ekran_Xaritasi.md)** — to'liq menyu/ekran xaritasi: 14 ta ekran, har biri uchun maqsad, elementlar, foydalanuvchi amallari va navigatsiya + rollar jadvali.- **[RASTA_Wireframes.md](./RASTA_Wireframes.md)** — 7 ta asosiy ekranning matnli (ASCII) wireframe maketlari + dizayn tizimi (ranglar, brending).
- **[RASTA_Kategoriyalar.md](./RASTA_Kategoriyalar.md)** — keng, aniq va ierarxik kategoriya tizimi (16 asosiy kategoriya + kichik kategoriyalar) hamda e'lon turi (Do'kon/Shaxsiy) va holat (Yangi/Ishlatilgan) ajratish.

### Spec (MVP qurilish rejasi)

`.kiro/specs/rasta-mvp/` papkasida:
- **[requirements.md](./.kiro/specs/rasta-mvp/requirements.md)** — MVP talablari (11 ta, user stories + qabul mezonlari).
- **[design.md](./.kiro/specs/rasta-mvp/design.md)** — texnik dizayn (Next.js + Supabase, DB sxemasi, komponentlar).
- **[tasks.md](./.kiro/specs/rasta-mvp/tasks.md)** — kod yozish bosqichlari (10 bosqich, ~30 vazifa).

> **Texnologiya (MVP):** Next.js 14 + TypeScript + Tailwind + Supabase, Vercel'da bepul deploy.

### Interaktiv prototip (ilova ko'rinishi)

- **[prototype/index.html](./prototype/index.html)** — ilovaning interaktiv demo ko'rinishi (21 ta ekran: professional SVG ikonkalar, takomillashtirilgan ranglar, aniq kategoriya gridi, **professional do'kon storefront**, **3D mahsulot ko'rinishi**, e'lon turi va Yangi/Ishlatilgan ajratish, kengaytirilgan do'kon boshqaruvi, dark mode).
- **[prototype/3d-demo.html](./prototype/3d-demo.html)** — **haqiqiy 3D/AR model demo** (Google model-viewer, GLB format). Brauzerda 3D modelni aylantirib, telefonda AR orqali xonangizda ko'rishingiz mumkin.
- **Ko'rish:** [htmlpreview orqali oching](https://htmlpreview.github.io/?https://github.com/xudush92-cmd/RASTA/blob/main/prototype/index.html) yoki faylni yuklab olib brauzerda oching.

## Asosiy model

RASTA'da e'lonlar **ikki xil va aniq ajratilgan** turda bo'ladi:

- **🏪 Do'kon e'loni (PULLI)** — ro'yxatdan o'tgan, tasdiqlangan do'konlar. Oylik obuna (Boshlang'ich ~49k / Standart ~99k / Premium ~199k so'm), keng boshqaruv paneli, batafsil statistika. E'lonlarida "Do'kon ✓" belgisi.
- **👤 Shaxsiy e'lon (BEPUL)** — yakka shaxslar uchun oddiy e'lon joylash (cheklangan imkoniyatlar). E'lonlarida "Shaxsiy" belgisi.

Qo'shimcha tamoyillar:
- **Yangi** va **ishlatilgan** mahsulotlar har doim ajratiladi (alohida tab/filtr) — aralashmaydi.
- **Kategoriyalar** keng, aniq va ierarxik (asosiy kategoriya → kichik kategoriya). Batafsil: [RASTA_Kategoriyalar.md](./RASTA_Kategoriyalar.md).
- Ilova ichida xaridor-sotuvchi to'lovi yo'q; yagona to'lov — do'kon obunasi (Payme/Click/Uzum).

## Loyiha bosqichlari (qisqa)

1. **MVP** — Auth, do'kon profili, mahsulot joylash, qidiruv, chat
2. **v2** — Xarita/geolokatsiya, filtrlar, sharh va reyting, push
3. **v3** — Admin moderatsiya paneli, boost/monetizatsiya, analitika
4. **v4** — Mikroservis, AI qidiruv va tavsiyalar, masshtablash
