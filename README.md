# RASTA

Butun O'zbekiston uchun **onlayn bozor (katalog-marketplace)** ilovasi.

Bozorlar, supermarketlar va barcha turdagi sotuvchilar o'z do'konlarini ochib, mahsulotlarini joylaydi. Xaridor mahsulotni qidirib topadi, do'konga boradi yoki sotuvchi bilan bog'lanadi.

> **Asosiy tamoyil:** ilova ichida oldi-sotdi (to'lov) amalga oshirilmaydi. Ilova katalog, do'kon profillari, qidiruv va aloqa vazifasini bajaradi (OLX / Avito modeli).

## Hujjatlar

- **[RASTA_Loyiha_Rejasi_v2.pdf](./RASTA_Loyiha_Rejasi_v2.pdf)** ⭐ — to'liq reja (v2). To'rt mutaxassis (UI/UX dizayn, mahsulot menejmenti, tizim arxitekturasi, xavfsizlik) tahlili asosida: navigatsiya/menyular, obuna tariflari, do'kon boshqaruv paneli, statistika, texnologiya steki, integratsiyalar, ma'lumotlar bazasi, Trust & Safety, mahalliylashtirish va yo'l xaritasi.
- [Uzbekiston_Onlayn_Bozor_Loyiha_Rejasi.pdf](./Uzbekiston_Onlayn_Bozor_Loyiha_Rejasi.pdf) — birinchi versiya (v1).
- `build_pdf.py` / `build_pdf_v2.py` — PDF'larni qayta yaratuvchi skriptlar (sof Python, tashqi kutubxonasiz).

## Asosiy model

- **PULLI Do'kon** — oylik obuna (Boshlang'ich ~49k / Standart ~99k / Premium ~199k so'm), keng boshqaruv paneli, batafsil statistika.
- **BEPUL e'lon** — OLX uslubida oddiy e'lon joylash.
- Ilova ichida xaridor-sotuvchi to'lovi yo'q; yagona to'lov — do'kon obunasi (Payme/Click/Uzum).

## Loyiha bosqichlari (qisqa)

1. **MVP** — Auth, do'kon profili, mahsulot joylash, qidiruv, chat
2. **v2** — Xarita/geolokatsiya, filtrlar, sharh va reyting, push
3. **v3** — Admin moderatsiya paneli, boost/monetizatsiya, analitika
4. **v4** — Mikroservis, AI qidiruv va tavsiyalar, masshtablash
