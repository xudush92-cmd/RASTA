# RASTA

Butun O'zbekiston uchun **onlayn bozor (katalog-marketplace)** ilovasi.

Bozorlar, supermarketlar va barcha turdagi sotuvchilar o'z do'konlarini ochib, mahsulotlarini joylaydi. Xaridor mahsulotni qidirib topadi, do'konga boradi yoki sotuvchi bilan bog'lanadi.

> **Asosiy tamoyil:** ilova ichida oldi-sotdi (to'lov) amalga oshirilmaydi. Ilova katalog, do'kon profillari, qidiruv va aloqa vazifasini bajaradi.

## Hujjatlar

- **[RASTA_INFRATUZILMA_REJASI.md](./RASTA_INFRATUZILMA_REJASI.md)** ⭐ — amaldagi kanonik mahsulot va texnik reja: 3D/AR'siz ko'p turdagi do'konlar, rollar, katalog, qidiruv, xavfsizlik, tenant izolatsiyasi, infratuzilma, bosqichlar va qabul mezonlari.
- [RASTA_Loyiha_Rejasi_v2.pdf](./RASTA_Loyiha_Rejasi_v2.pdf) — oldingi reja (v2); yangi qarorlarda kanonik infratuzilma rejasiga ustuvorlik beriladi.
- [Uzbekiston_Onlayn_Bozor_Loyiha_Rejasi.pdf](./Uzbekiston_Onlayn_Bozor_Loyiha_Rejasi.pdf) — birinchi versiya (v1).
- `build_pdf.py` / `build_pdf_v2.py` — PDF'larni qayta yaratuvchi skriptlar (sof Python, tashqi kutubxonasiz).

### Dizayn va menyular

- **[RASTA_Ekran_Xaritasi.md](./RASTA_Ekran_Xaritasi.md)** — to'liq menyu/ekran xaritasi: 14 ta ekran, har biri uchun maqsad, elementlar, foydalanuvchi amallari va navigatsiya + rollar jadvali.
- **[RASTA_Wireframes.md](./RASTA_Wireframes.md)** — 7 ta asosiy ekranning matnli (ASCII) wireframe maketlari + dizayn tizimi (ranglar, brending).
- **[RASTA_Kategoriyalar.md](./RASTA_Kategoriyalar.md)** — keng, aniq va ierarxik kategoriya tizimi (16 asosiy kategoriya + kichik kategoriyalar) hamda e'lon turi (Do'kon/Shaxsiy) va holat (Yangi/Ishlatilgan) ajratish.

### Dastlabki Spec (implementatsiyadan oldin yangilanadi)

`.kiro/specs/rasta-mvp/` papkasidagi hujjatlar ilk MVP draftidir. Yangi qarorlarda **RASTA_INFRATUZILMA_REJASI.md ustuvor**; kod boshlanishidan oldin spec shu reja asosida qayta generatsiya qilinadi:
- **[requirements.md](./.kiro/specs/rasta-mvp/requirements.md)** — MVP talablari (12 ta, user stories + qabul mezonlari).
- **[design.md](./.kiro/specs/rasta-mvp/design.md)** — texnik dizayn (Next.js + Supabase, DB sxemasi, komponentlar).
- **[tasks.md](./.kiro/specs/rasta-mvp/tasks.md)** — kod yozish bosqichlari (10 bosqich, ~30 vazifa).

> **Texnologiya (MVP):** Next.js + TypeScript + Tailwind + Supabase/PostgreSQL. Aniq versiyalar implementatsiya boshlanganda amaldagi barqaror/LTS relizlarga pin qilinadi.

### Interaktiv prototiplar (ilova ko'rinishi)

- **[prototype/rasta-social.html](./prototype/rasta-social.html)** ⭐⭐ — Instagram uslubidagi ijtimoiy marketplace ko'rinishi: feed + stories, **Reels uslubidagi yuqoriga surib tomosha** (boshqa do'kon mahsulotlariga ham o'tadi), rasm ustida **tugma orqali mahsulot ma'lumoti**, do'konga **obuna + qo'ng'iroqcha** (yangi mahsulotda bildirishnoma), bildirishnomalar ekrani, explore gridi, do'kon profili (kuzatish/statistika/grid), DM inbox, saqlanganlar va alohida qorong'i do'kon dashboardi (KPI, SKU/qoldiq, murojaatlar, mahsulot yaratish). Responsive: desktop rail + feed, mobil top bar + bottom tab.
- **[Ijtimoiy namunani brauzerda ko'rish](https://htmlpreview.github.io/?https://github.com/xudush92-cmd/RASTA/blob/main/prototype/rasta-social.html)** — desktop yoki telefonda ochiladi.
- **[prototype/app-demo.html](./prototype/app-demo.html)** — oldingi polished katalog namunasi (xaridor + do'kon dashboardi).
- **[prototype/index.html](./prototype/index.html)** — dastlabki keng ekranlar xaritasi va click-demo.

## Asosiy model

RASTA'da e'lonlar **ikki xil va aniq ajratilgan** turda bo'ladi:

- **🏪 Do'kon mahsuloti** — ro'yxatdan o'tgan va tekshiruvdan o'tgan do'konlar, boshqaruv paneli va batafsil statistika. Pilotda trial/manual entitlement beriladi; pullik obuna va reklama muvaffaqiyatli pilotdan keyingi P1 bosqichida. Mahsulotlarda "Do'kon ✓" belgisi.
- **👤 Shaxsiy e'lon (BEPUL)** — yakka shaxslar uchun oddiy e'lon joylash (cheklangan imkoniyatlar). E'lonlarida "Shaxsiy" belgisi.

Qo'shimcha tamoyillar:
- **Yangi** va **ishlatilgan** mahsulotlar har doim ajratiladi (alohida tab/filtr) — aralashmaydi.
- **Kategoriyalar** keng, aniq va ierarxik (asosiy kategoriya → kichik kategoriya). Batafsil: [RASTA_Kategoriyalar.md](./RASTA_Kategoriyalar.md).
- Ilova ichida xaridor-sotuvchi to'lovi yo'q. Pilotda do'kon trial/manual entitlement bilan ishlaydi; keyinchalik faqat RASTA obuna va reklama xizmatlari uchun to'lov qo'shiladi.

## Loyiha bosqichlari (qisqa)

1. **Poydevor** — Auth, tenant/RBAC, audit, dizayn tizimi, monitoring va backup
2. **MVP katalog** — do'kon yaratish/tekshirish, mahsulot/variant/qoldiq, moderatsiya va storefront
3. **MVP aloqa** — qidiruv/filtr, chat, murojaat, shikoyat va do'kon analitikasi
4. **Pilotdan keyin** — obuna/reklama, filiallar, ommaviy import, sharh va kengaytirilgan analytics

Bosqichlar va chiqish mezonlari: [RASTA_INFRATUZILMA_REJASI.md](./RASTA_INFRATUZILMA_REJASI.md#20-bosqichma-bosqich-amalga-oshirish).
