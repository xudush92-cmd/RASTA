# RASTA — To'liq Menyu / Ekran Xaritasi

> **Loyiha:** Butun O'zbekiston uchun onlayn bozor (katalog-marketplace).
> **Model:** Ilova ichida xaridor-sotuvchi to'lovi yo'q (faqat aloqa). Sotuvchilar do'kon ochib mahsulot joylaydi, xaridor qidirib topadi va chat yoki telefon orqali bog'lanadi.
> **Ikki bo'lim:** (1) Tasdiqlangan **Do'kon mahsuloti** — pilotda trial/manual entitlement, pullik obuna P1; boshqaruv paneli va statistika. (2) BEPUL **Shaxsiy e'lon**.
> **Kontekst va rollar:** bitta user xaridor va shaxsiy sotuvchi bo'la oladi; do'konda `Owner` / `Manager` / `Catalog manager` / `Support`, platformada `Moderator` / `Admin` rollari mavjud.

## Asosiy navigatsiya — Pastki menyu (5 ta)

Ilovaning markaziy navigatsiyasi pastki panelda joylashgan 5 ta doimiy menyudan iborat:

1. **🏠 Bosh sahifa** — tavsiyalar, banner, kategoriyalar, yangi e'lonlar.
2. **🔍 Qidiruv** — qidiruv qatori, filtr va natijalar.
3. **➕ Joylash** — bepul e'lon yoki do'kon mahsuloti qo'shish (markaziy tugma).
4. **💬 Xabarlar** — chatlar ro'yxati va suhbatlar.
5. **👤 Profil** — shaxsiy kabinet, do'kon, sozlamalar.

---

## 1. Onboarding (Til + Shahar)

**Maqsad:** Ilovaga birinchi kirgan foydalanuvchini sozlash — interfeys tili va joylashuv (shahar/viloyat) tanlash.

**Ekran elementlari:**
- RASTA logotipi va qisqa shior.
- Til tanlash: O'zbekcha (P0) · Ruscha va Qoraqalpoqcha (P1).
- Shahar / viloyat tanlash ro'yxati (yoki "Joylashuvni aniqlash" tugmasi).
- 2–3 ta tanishtiruv slayd (ilova nima qiladi: qidir, top, bog'lan).
- "Davom etish" va "O'tkazib yuborish" tugmalari.

**Foydalanuvchi amallari:**
- Tilni tanlash.
- Shahar/viloyatni qo'lda tanlash yoki GPS orqali aniqlash.
- Slaydlarni varaqlash.
- Davom etish / O'tkazib yuborish.

**Navigatsiya:**
- "Davom etish" → Bosh sahifa (mehmon rejimida) yoki Ro'yxatdan o'tish.
- Til/shahar keyinchalik Sozlamalardan o'zgartiriladi.

---

## 2. Ro'yxatdan o'tish / Kirish + OTP

**Maqsad:** Telefon raqami orqali ro'yxatdan o'tish yoki tizimga kirish (SMS kod tasdiqlash).

**Ekran elementlari:**
- Telefon raqami kiritish qatori (+998 prefiks bilan).
- "Kodni olish" tugmasi.
- OTP kod kiritish maydoni (4–6 raqamli), qayta yuborish taymeri.
- Foydalanish shartlari va Maxfiylik siyosatiga rozilik belgisi.
- Muqobil kirish (ixtiyoriy): Google / Apple.
- "Mehmon sifatida davom etish" havolasi.

**Foydalanuvchi amallari:**
- Telefon raqamini kiritib SMS kod so'rash.
- OTP kodni kiritib tasdiqlash.
- Kodni qayta yuborishni so'rash.
- Mehmon rejimida kirish.

**Navigatsiya:**
- Muvaffaqiyatli tasdiq → Bosh sahifa (birinchi marta bo'lsa — profil to'ldirish: ism va lokal sozlamalar; qaytmas rol tanlovi yo'q).
- "Mehmon" → Bosh sahifa (cheklangan: e'lon joylash va chat uchun keyin kirish so'raladi).

---

## 3. Bosh sahifa

**Maqsad:** Foydalanuvchini tavsiyalar, kategoriyalar va yangi e'lonlar bilan tanishtirish — kashfiyot nuqtasi.

**Ekran elementlari:**
- Yuqori panel: joriy shahar (almashtirish mumkin), bildirishnoma 🔔 va sevimlilar ❤️ belgilari.
- Qidiruv qatori (bosilganda Qidiruv ekraniga o'tadi).
- Reklama / aksiya bannerlari (slayder).
- Kategoriyalar tasmasi (ikonkalar bilan).
- "Tavsiya etilamiz" bo'limi — tanlangan e'lonlar.
- "Yangi e'lonlar" lentasi (kartochkalar: rasm, narx, sarlavha, joylashuv, do'kon belgisi).
- "Yaqin atrofdagi do'konlar" bo'limi (geolokatsiya bo'yicha).
- Pastki 5 menyu.

**Foydalanuvchi amallari:**
- Shaharni almashtirish.
- Bannerga bosish (aksiya/do'kon sahifasiga).
- Kategoriya yoki e'lon kartochkasini ochish.
- E'lonni sevimlilarga qo'shish (❤️).
- Pastga aylantirib lentani yuklash.

**Navigatsiya:**
- Qidiruv qatori → Qidiruv ekrani.
- Kategoriya → Qidiruv natijalari (filtr bilan).
- E'lon kartochkasi → Mahsulot/e'lon batafsil sahifasi.
- Do'kon belgisi → Do'kon profili sahifasi.
- 🔔 → Bildirishnomalar, ❤️ → Sevimlilar.

---

## 4. Kategoriyalar

**Maqsad:** Barcha kategoriya va kichik kategoriyalarni tartibli ko'rsatish — bo'limlar bo'yicha kezish.

**Ekran elementlari:**
- Sarlavha "Kategoriyalar" va qidiruv qatori.
- Asosiy kategoriyalar ro'yxati (Elektronika, Kiyim, Uy-ro'zg'or, Transport, Ko'chmas mulk, Oziq-ovqat, Go'zallik, Bolalar, Xizmatlar va h.k.).
- Har bir kategoriya bosilganda ochiladigan kichik kategoriyalar.
- Ikonka va e'lonlar soni (ixtiyoriy).

**Foydalanuvchi amallari:**
- Kategoriyani tanlash.
- Kichik kategoriyaga o'tish.
- Kategoriya ichidan qidirish.

**Navigatsiya:**
- Kcategory / kichik kategoriya → Qidiruv natijalari (shu kategoriya filtri bilan).

---

## 5. Qidiruv + Filtr Natijalari

**Maqsad:** Foydalanuvchiga kerakli mahsulot/e'lonni kalit so'z va filtrlar orqali topish.

**Ekran elementlari:**
- Yuqorida qidiruv qatori (matn kiritish, mikрofon/ovozli qidiruv ixtiyoriy).
- Oxirgi qidiruvlar va ommabop so'rovlar (qator bo'sh bo'lganda).
- Filtr paneli: kategoriya, narx oralig'i, shahar/tuman, holati (yangi/ishlatilgan), faqat do'konlar, yetkazib berish, masofa.
- Saralash: yangiligi bo'yicha · narx (arzon→qimmat) · narx (qimmat→arzon) · ommabopligi.
- Ko'rinish almashtirish: ro'yxat / katak (grid) / xarita.
- Natijalar lentasi (kartochkalar: rasm, narx, sarlavha, joylashuv, "PRO/Do'kon" yorlig'i).
- Natija bo'lmasa — bo'sh holat va tavsiyalar.

**Foydalanuvchi amallari:**
- Kalit so'z kiritib qidirish.
- Filtr va saralashni qo'llash, tozalash.
- Ko'rinishni almashtirish (ro'yxat/grid/xarita).
- E'lonni ochish yoki sevimlilarga qo'shish.
- Qidiruvni saqlash va natija bildirishnomasi (P1).

**Navigatsiya:**
- E'lon kartochkasi → Mahsulot/e'lon batafsil sahifasi.
- Do'kon yorlig'i → Do'kon profili sahifasi.
- Xarita ko'rinishi → Xaritada e'lon nuqtalari.

---

## 6. Mahsulot / E'lon Batafsil Sahifasi

**Maqsad:** Bitta mahsulot yoki e'lon haqida to'liq ma'lumot berish va sotuvchi bilan bog'lanish imkonini yaratish.

**Ekran elementlari:**
- Rasmlar galereyasi (slayder, kattalashtirish).
- Sarlavha, narx, holati (yangi/ishlatilgan), joylashuv va e'lon sanasi.
- Tavsif (to'liq matn).
- Xususiyatlar/parametrlar jadvali (kategoriyaga qarab).
- Sotuvchi/do'kon kartochkasi (nomi, reyting, "PRO" belgisi, ro'yxatdagi vaqti).
- Joylashuv xaritasi (taxminiy nuqta).
- Ko'rishlar soni, sevimlilarga qo'shilganlar soni.
- Sharhlar va reyting bo'limi (do'kon mahsuloti uchun, P1).
- "O'xshash e'lonlar" bo'limi.
- Pastki doimiy panel: "Yozish (chat)" va "Qo'ng'iroq" tugmalari.

**Foydalanuvchi amallari:**
- Rasmlarni ko'rish.
- Sotuvchiga chat yozish yoki qo'ng'iroq qilish.
- Sevimlilarga qo'shish (❤️).
- E'lonni ulashish (share).
- Shikoyat qilish / e'lonni shikoyat tugmasi.
- Do'kon profiliga o'tish.

**Navigatsiya:**
- "Yozish" → Xabarlar / Chat (shu sotuvchi bilan).
- "Qo'ng'iroq" → telefon ilovasi.
- Sotuvchi kartochkasi → Do'kon profili sahifasi.
- O'xshash e'lon → boshqa Batafsil sahifa.

---

## 7. Do'kon Profili Sahifasi

**Maqsad:** Tasdiqlangan do'kon (yoki sotuvchi) brendini, barcha mahsulotlarini va aloqa ma'lumotlarini bir joyda ko'rsatish.

**Ekran elementlari:**
- Muqova rasmi va do'kon logotipi.
- Do'kon nomi, "PRO" belgisi, reyting va sharhlar soni.
- Qisqa tavsif, ish vaqti, manzil va xaritadagi nuqta.
- Statistika: e'lonlar soni, obunachilar (ixtiyoriy), ro'yxatdagi vaqti.
- Mahsulot kategoriyalari/bo'limlar bo'yicha tasniflash.
- Mahsulotlar lentasi (grid).
- Sharhlar bo'limi (P1).
- Aloqa: telefon, manzil, ijtimoiy tarmoq havolalari.

**Foydalanuvchi amallari:**
- Do'konga obuna bo'lish / kuzatish.
- Do'kon ichidan qidirish va filtrlash.
- Mahsulotni ochish.
- Chat yozish yoki qo'ng'iroq qilish.
- Do'konni ulashish yoki shikoyat qilish.

**Navigatsiya:**
- Mahsulot → Mahsulot batafsil sahifasi.
- "Yozish" → Chat.
- Sharhlar → Sharhlar ro'yxati.

---

## 8. Joylash (➕)

**Maqsad:** Foydalanuvchiga e'lon turini tanlash imkonini berish: BEPUL oddiy e'lon yoki DO'KON mahsuloti.

### 8.0 Tanlov ekrani (➕ bosilganda)
- "Shaxsiy e'lon joylash" varianti (yakka shaxslar uchun, bepul).
- "Do'kon mahsuloti qo'shish" varianti (faqat do'kon egalari uchun; do'koni yo'q bo'lsa → "Do'kon ochish / Obuna" taklifi).
- Qisqa farq tushuntirishi (bepul vs PRO imkoniyatlari).

### 8.A Bepul e'lon joylash formasi
**Elementlar:**
- Rasm yuklash (cheklangan son, masalan 5 tagacha).
- Sarlavha, kategoriya tanlash.
- Narx (yoki "Kelishilgan").
- Tavsif.
- Holati (yangi/ishlatilgan).
- Joylashuv (shahar/tuman, xarita nuqtasi).
- Aloqa: telefon, chat ruxsati.

**Amallar:** rasm qo'shish/o'chirish, maydonlarni to'ldirish, "Oldindan ko'rish", "E'lon joylash".

**Navigatsiya:** Joylashdan keyin → Moderatsiya holati / Mening e'lonlarim.

### 8.B Do'kon mahsuloti qo'shish formasi
**Elementlar:**
- Ko'proq rasm va video imkoniyati.
- To'liq xususiyatlar/parametrlar.
- Ombor/qoldiq, variantlar (rang, o'lcham).
- Yetkazib berish sozlamalari.
- Bo'lim/kategoriya tanlash.
- "Boost / Ko'tarish" varianti.

**Amallar:** to'ldirish, qoralama saqlash, "Oldindan ko'rish", "Joylash".

**Navigatsiya:** Joylashdan keyin → Do'kon boshqaruv paneli → Mahsulotlar.

> **Kirish sharti:** Mehmon yoki ro'yxatdan o'tmagan foydalanuvchi ➕ bossa → Ro'yxatdan o'tish / OTP ekraniga yo'naltiriladi.

---

## 9. Xabarlar / Chat

**Maqsad:** Xaridor va sotuvchi o'rtasidagi yozishmalarni boshqarish (ilova ichidagi aloqa).

**Ekran elementlari:**
- **Chatlar ro'yxati:** suhbatdosh avatari/nomi, oxirgi xabar, vaqt, o'qilmagan belgisi, e'lon mini-rasmi.
- Qidiruv qatori (chatlar ichidan).
- **Chat ichi:** xabarlar tasmasi, e'lon kartochkasi (yuqorida), matn kiritish, rasm/fayl yuborish, ovozli xabar (ixtiyoriy).
- Tezkor javoblar (shablonlar): "Narxi kelishiladi?", "Bormi?", "Manzilni yuboring".
- Holat belgilari: yuborildi / o'qildi.

**Foydalanuvchi amallari:**
- Chatni ochish, xabar yozish/yuborish.
- Rasm yoki fayl jo'natish.
- Suhbatdoshni bloklash yoki shikoyat qilish.
- Chatni o'chirish.
- E'lon kartochkasidan mahsulotga o'tish.

**Navigatsiya:**
- Chat ro'yxati → Chat ichi.
- Chatdagi e'lon kartochkasi → Mahsulot batafsil sahifasi.
- Suhbatdosh nomi → Do'kon profili (agar do'kon bo'lsa).

---

## 10. Sevimlilar

**Maqsad:** Foydalanuvchi saqlab qo'ygan e'lonlar va do'konlarni bir joyda ko'rsatish.

**Ekran elementlari:**
- Tablar: "E'lonlar" / "Do'konlar" / "Saqlangan qidiruvlar".
- Saqlangan e'lonlar lentasi (kartochka, narx o'zgarishi belgisi).
- Bo'sh holat ko'rinishi (hech narsa saqlanmaganda).

**Foydalanuvchi amallari:**
- Sevimlidan olib tashlash.
- E'lonni ochish.
- Saqlangan do'konga o'tish.
- Saqlangan qidiruvni qayta ishga tushirish.

**Navigatsiya:**
- E'lon → Mahsulot batafsil sahifasi.
- Do'kon → Do'kon profili.
- Qidiruv → Qidiruv natijalari.

---

## 11. Profil / Kabinet (Bepul foydalanuvchi)

**Maqsad:** Bepul foydalanuvchining shaxsiy markazi — e'lonlari, sozlamalari va do'kon ochish taklifi.

**Ekran elementlari:**
- Yuqorida: avatar, ism, telefon, reyting (ixtiyoriy), "Profilni tahrirlash".
- **"Do'kon oching"** banneri; do'kon yaratish va tekshiruv jarayoniga olib boradi.
- Mening e'lonlarim (faol / moderatsiyada / muddati tugagan).
- Sevimlilar havolasi.
- Ko'rilgan e'lonlar tarixi.
- Bildirishnomalar.
- Yordam / Qo'llab-quvvatlash.
- Sozlamalar havolasi.
- Chiqish (Logout).

**Foydalanuvchi amallari:**
- Profilni tahrirlash.
- E'lonlarni boshqarish (tahrirlash, o'chirish, ko'tarish).
- Do'kon ochish jarayonini boshlash.
- Sozlamalar va yordamga o'tish.

**Navigatsiya:**
- "Do'kon oching" → Do'kon yaratish va tekshiruv formasiga; tarif/to'lov do'kon ochishga gate emas.
- "Mening e'lonlarim" → e'lon tahrirlash.
- Sozlamalar → Sozlamalar ekrani.

---

## 12. Do'kon Boshqaruv Paneli (10 bo'lim)

**Maqsad:** Tasdiqlangan do'kon egasiga katalog va mijoz murojaatlarini boshqarish — mahsulotlar, qoldiq, murojaatlar, statistika va sozlamalar.

**Asosiy ko'rinish:** Dashboard bosh sahifasi (umumiy ko'rsatkichlar: bugungi ko'rishlar, yangi xabarlar, faol e'lonlar, verification va pilot entitlement holati). Quyidagi bo'limlarga alohida dashboard navigatsiyasi orqali o'tiladi:

1. **Dashboard (Bosh ko'rsatkichlar)** — kunlik/oylik xulosa, tezkor statistika va ogohlantirishlar.
2. **Mahsulotlar** — barcha mahsulotlar ro'yxati, qo'shish/tahrirlash/o'chirish, faol/nofaol, qoldiq.
3. **Statistika / Analitika** — ko'rishlar, qo'ng'iroqlar, chatlar, sevimlilar, konversiya grafiklari, davr bo'yicha solishtirish.
4. **Xabarlar / Mijozlar** — do'kon chatlari, tezkor javoblar, mijozlar bazasi.
5. **Sharhlar va Reyting (P1)** — sharhlarni ko'rish, javob berish, o'rtacha reyting.
6. **Reklama / Boost (P1)** — aniq “Reklama” yorlig'i bilan pullik joylashuv va kampaniyalar.
7. **Obuna va To'lovlar (P1)** — tarif, to'lov tarixi va tarifni o'zgartirish; P0 pilotda faqat trial/manual entitlement holati.
8. **Do'kon sozlamalari** — nomi, logo, muqova, tavsif, ish vaqti, manzil, ijtimoiy havolalar.
9. **Xodimlar / Rollar** — `Owner`, `Manager`, `Catalog manager`, `Support` rollari va permissionlar; obunadan qat'i nazar P0 xavfsizligi uchun mavjud.
10. **Yordam va Qo'llab-quvvatlash** — murojaat, qo'llanma, savdo bo'yicha maslahatlar.

**Foydalanuvchi amallari:**
- Mahsulot qo'shish/boshqarish.
- Statistikani ko'rish va eksport qilish.
- Mijozlarga javob berish.
- Reklama va tarifni boshqarish (P1).

**Navigatsiya:**
- Har bir bo'lim → tegishli batafsil ekran.
- "Mahsulot qo'shish" → Do'kon mahsuloti formasi (8.B).
- "Obuna va To'lovlar" → Obuna / Tariflar ekrani (P1).

---

## 13. Obuna / Tariflar Ekrani (P1 — muvaffaqiyatli pilotdan keyin)

**Maqsad:** Do'kon ochishga gate bo'lmasdan, RASTA monetizatsiyasi ishga tushgach obuna tariflarini ko'rsatish va xizmat to'lovini amalga oshirish.

**Ekran elementlari:**
- Sarlavha va qisqa qiymat taklifi ("Do'kon ochib, ko'proq mijozga yeting").
- 3 ta tarif kartochkasi taqqoslash bilan:
  - **Boshlang'ich — ~49 000 so'm/oy:** cheklangan mahsulot soni, asosiy statistika.
  - **Standart — ~99 000 so'm/oy:** ko'proq mahsulot, kengaytirilgan statistika, boost chegirmasi.
  - **Premium — ~199 000 so'm/oy:** cheksiz mahsulot, to'liq analitika, xodimlar, ustuvor joylashuv.
- Imkoniyatlar taqqoslash jadvali (✓/✗).
- To'lov davri tanlash (oylik / yillik chegirma bilan).
- To'lov usullari: Payme · Click · Uzum.
- Shartlar va avto-yangilanish haqida eslatma.
- "Tarifni tanlash" / "Obunani rasmiylashtirish" tugmasi.

**Foydalanuvchi amallari:**
- Tariflarni taqqoslash.
- Davrni tanlash.
- To'lov usulini tanlab to'lovni amalga oshirish.
- Promo-kod kiritish.

**Navigatsiya:**
- "Tarifni tanlash" → RASTA xizmat to'lovi (Payme/Click/Uzum) → muvaffaqiyat → entitlement yangilanadi.
- Birinchi do'kon yaratish bu ekranga bog'lanmaydi: Do'kon yaratish → Tekshiruv → trial/manual entitlement → Dashboard.

---

## 14. Sozlamalar

**Maqsad:** Ilova va hisob sozlamalarini boshqarish.

**Ekran elementlari:**
- **Hisob:** profilni tahrirlash, telefon raqamini o'zgartirish, parol/xavfsizlik.
- **Til:** O'zbekcha (P0); Ruscha va Qoraqalpoqcha (P1).
- **Joylashuv / Shahar:** standart shaharni o'zgartirish.
- **Bildirishnomalar:** push, chat, narx o'zgarishi, marketing (yoqish/o'chirish).
- **Maxfiylik:** bloklangan foydalanuvchilar, telefon ko'rinishi, ma'lumotlarni boshqarish.
- **Ko'rinish:** mavzu (yorug'/qorong'i).
- **Yordam markazi va FAQ.**
- **Foydalanish shartlari va Maxfiylik siyosati.**
- **Ilova haqida (versiya).**
- **Hisobni o'chirish** va **Chiqish (Logout).**

**Foydalanuvchi amallari:**
- Til, shahar, mavzuni o'zgartirish.
- Bildirishnomalarni sozlash.
- Bloklangan foydalanuvchilarni boshqarish.
- Hisobdan chiqish yoki hisobni o'chirish.

**Navigatsiya:**
- "Profilni tahrirlash" → Profil tahrirlash ekrani.
- "Yordam markazi" → Yordam/FAQ.
- "Chiqish" → Kirish ekrani.

---

## Navigatsiya xaritasi (qisqa sxema)

```
Onboarding (til + hudud) → Bosh sahifa (mehmon)
                              │
          ┌───────────────────┼───────────────────┐
          ▼                   ▼                   ▼
       Qidiruv             Mahsulot           Do'kon vitrinasi
          │                   │                   │
          └────────────── chat/saqlash ───────────┘
                              │
                           OTP login
                              │
                 Shaxsiy profil/kontekst
                    │                    │
                    ▼                    ▼
             Shaxsiy e'lon         Do'kon yaratish
                                     │
                                     ▼
                         Tekshiruv + pilot entitlement
                                     │
                                     ▼
                           DO'KON DASHBOARD SHELL
                 (mahsulot, qoldiq, murojaat, xodim, analytics)
                                     │
                                     └── Obuna/reklama (P1)
```

---

## Kontekst va rollar bo'yicha ekran ko'rinishi

| Ekran | Mehmon | Shaxsiy profil | Do'kon membershipi | Moderator/Admin |
|---|---|---|---|---|
| Bosh sahifa / Qidiruv / Do'kon vitrinasi | ✓ | ✓ | ✓ | ✓ |
| Sevimlilar / Chat | login so'raladi | ✓ | ✓ | ruxsatga qarab |
| Shaxsiy e'lon joylash | — | ✓ | ✓ | — |
| Do'kon mahsuloti qo'shish | — | — | permission bo'lsa | moderator faqat ko'rib chiqadi |
| Do'kon dashboard shell | — | — | `Owner/Manager/Catalog manager/Support` permissioniga qarab | audit/support rejimi |
| Obuna / Tariflar (P1) | taklif | taklif | owner | admin boshqaradi |
| Moderatsiya paneli (P0) | — | — | — | ✓ |

> **Eslatma:** Asosiy admin moderatsiya paneli (do'kon/e'lon tasdiqlash, shikoyatlar, bloklash va audit) Trust & Safety uchun MVP tarkibiga kiradi va alohida himoyalangan web-panel sifatida ishlab chiqiladi.
