# RASTA

Butun O'zbekiston uchun **onlayn bozor (katalog-marketplace)** ilovasi.

Bozorlar, supermarketlar va barcha turdagi sotuvchilar o'z do'konlarini ochib, mahsulotlarini joylaydi. Xaridor mahsulotni qidirib topadi, do'konga boradi yoki sotuvchi bilan bog'lanadi.

> **Asosiy tamoyil:** ilova ichida oldi-sotdi (to'lov) amalga oshirilmaydi. Ilova katalog, do'kon profillari, qidiruv va aloqa vazifasini bajaradi.

> **Yagona manba:** loyihaning rasmiy rejasi — **RASTA_INFRATUZILMA_REJASI.md**, rasmiy dizayn/ilova ko'rinishi — **prototype/rasta-social.html**. Eski reja, wireframe va prototip fayllari chalkashmaslik uchun olib tashlangan.

## 🚀 Ishlaydigan ilova

**[app/](./app/)** — haqiqiy ishlaydigan ilova: server, SQLite baza, autentifikatsiya, e'lon CRUD,
rasm yuklash, moderatsiya va super admin panel. Ma'lumotlar haqiqatan saqlanadi.

```bash
cd app
npm run seed    # namuna ma'lumotlar
npm start       # http://localhost:3000
npm test        # 33 ta uchidan-uchiga test
```

Talab: Node.js 22.5+ (tashqi kutubxona ishlatilmaydi). Sinov hisoblari va batafsil ma'lumot:
**[app/README.md](./app/README.md)**.

`prototype/rasta-social.html` esa interaktiv **dizayn namunasi** sifatida qoladi (baza ulanmagan).

## Hujjatlar

- **[RASTA_INFRATUZILMA_REJASI.md](./RASTA_INFRATUZILMA_REJASI.md)** ⭐ — kanonik mahsulot va texnik reja: 3D/AR'siz ko'p turdagi do'konlar, rollar, katalog, qidiruv, xavfsizlik, tenant izolatsiyasi, infratuzilma, bosqichlar va qabul mezonlari.
- **[RASTA_Kategoriyalar.md](./RASTA_Kategoriyalar.md)** — keng, aniq va ierarxik kategoriya tizimi hamda e'lon turi (Do'kon/Shaxsiy) va holat (Yangi/Ishlatilgan) ajratish.

### Spec (implementatsiya uchun)

`.kiro/specs/rasta-mvp/` papkasi kanonik rejaga bo'ysunadi (kod boshlanishidan oldin shu reja asosida yangilanadi):
- **[requirements.md](./.kiro/specs/rasta-mvp/requirements.md)** — MVP talablari (user stories + qabul mezonlari).
- **[design.md](./.kiro/specs/rasta-mvp/design.md)** — texnik dizayn (DB sxemasi, komponentlar).
- **[tasks.md](./.kiro/specs/rasta-mvp/tasks.md)** — kod yozish bosqichlari.

> **Texnologiya (MVP):** Next.js + TypeScript + Tailwind + Supabase/PostgreSQL. Aniq versiyalar implementatsiya boshlanganda amaldagi barqaror/LTS relizlarga pin qilinadi.

### Rasmiy dizayn / ilova ko'rinishi

- **[prototype/rasta-social.html](./prototype/rasta-social.html)** ⭐ — Instagram uslubidagi ijtimoiy marketplace ko'rinishi: feed + stories, **Reels uslubidagi yuqoriga surib tomosha** (boshqa do'kon mahsulotlariga ham o'tadi), rasm ustida **tugma orqali mahsulot ma'lumoti**, do'konga **obuna + qo'ng'iroqcha** (yangi mahsulotda bildirishnoma), bildirishnomalar ekrani, explore gridi, do'kon profili (kuzatish/statistika/grid), DM inbox, saqlanganlar va alohida qorong'i do'kon dashboardi (KPI, SKU/qoldiq, murojaatlar, mahsulot yaratish). Responsive: desktop rail + feed, mobil top bar + bottom tab.
- **[Brauzerda ko'rish](https://htmlpreview.github.io/?https://github.com/xudush92-cmd/RASTA/blob/main/prototype/rasta-social.html)** — desktop yoki telefonda ochiladi.

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
