# RASTA MVP — Talablar (Requirements)

## Kirish

RASTA — butun O'zbekiston uchun onlayn bozor (katalog-marketplace). Ilova ichida xaridor-sotuvchi to'lovi yo'q: sotuvchilar do'kon ochib mahsulot joylaydi, xaridor qidirib topadi va chat/telefon orqali bog'lanadi.

E'lonlar ikki turda va aniq ajratilgan bo'ladi: **Do'kon e'loni** (pulli, tasdiqlangan do'konlar) va **Shaxsiy e'lon** (bepul, yakka shaxslar). Yangi va ishlatilgan mahsulotlar ham doimo ajratiladi.

Ushbu hujjat **MVP (birinchi ishlaydigan versiya)** uchun talablarni belgilaydi. MVP web (Next.js) ko'rinishidan boshlanadi.

### MVP doirasi (Scope)
- ✅ Telefon (OTP) orqali ro'yxatdan o'tish/kirish
- ✅ Shaxsiy e'lon joylash (bepul)
- ✅ Do'kon ochish va do'kon e'lonlari (pulli)
- ✅ Keng, ierarxik kategoriya tizimi
- ✅ Qidiruv va filtrlar (tur va holat ajratilgan)
- ✅ Mahsulot/e'lon batafsil sahifasi
- ✅ Chat (sotuvchi bilan aloqa)
- ✅ Sevimlilar
- ✅ Oddiy do'kon statistikasi
- ✅ Obuna tariflari (ko'rsatish; to'lov stub/keyin to'liq)
- ✅ Shikoyat (report) tizimi
- ❌ MVP'dan tashqari: xarita, AI tavsiya, video, mikroservis, admin web-panel (v2+)

---

## Talablar

### 1-talab: Autentifikatsiya (OTP)

**Foydalanuvchi hikoyasi:** Foydalanuvchi sifatida telefon raqamim orqali tez ro'yxatdan o'tmoqchiman, toki e'lon joylash va sotuvchi bilan bog'lanish mumkin bo'lsin.

**Qabul mezonlari:**
1. Foydalanuvchi telefon raqamini (+998 formatda) kiritsa, tizim SMS orqali OTP kod yuborishi KERAK.
2. To'g'ri OTP kiritilganda, tizim foydalanuvchini tizimga kiritishi va sessiya tokeni berishi KERAK.
3. Noto'g'ri yoki muddati o'tgan OTP kiritilganda, tizim xatolik ko'rsatishi KERAK.
4. Foydalanuvchi birinchi marta kirganda, tizim ism va rol (xaridor/sotuvchi) so'rashi KERAK.
5. Tizim mehmon (login'siz) rejimida ko'rish va qidiruvga ruxsat berishi KERAK; e'lon joylash yoki chat uchun login talab qilishi KERAK.
6. OTP so'rovlari uchun tizim rate limiting qo'llashi KERAK (spam/SMS-pumping himoyasi).

### 2-talab: Shaxsiy e'lon joylash (bepul)

**Foydalanuvchi hikoyasi:** Oddiy (yakka) foydalanuvchi sifatida bepul shaxsiy e'lon joylashtirmoqchiman, toki ortiqcha narsamni sota olay.

**Qabul mezonlari:**
1. Login qilgan foydalanuvchi e'lon formasini to'ldira olishi KERAK: rasm(lar), sarlavha, kategoriya, narx (yoki "Kelishiladi"), **holat (Yangi/Ishlatilgan — majburiy)**, hudud, tavsif, aloqa.
2. Tizim kamida 1 ta rasm va majburiy maydonlarni talab qilishi KERAK.
3. Shaxsiy e'lon uchun tizim rasm sonini cheklashi KERAK (masalan 5 tagacha).
4. E'lon joylanganda, tizim uni "moderatsiyada" yoki "faol" holatida saqlashi KERAK.
5. Tizim bepul foydalanuvchi uchun bir vaqtda faol e'lonlar sonini cheklashi MUMKIN (masalan 5 ta).
6. E'lon ma'lum muddatdan keyin (masalan 30 kun) "muddati tugagan" bo'lishi KERAK.
7. Shaxsiy e'lonlar do'kon e'lonlaridan vizual ravishda aniq ajralib turishi KERAK ("Shaxsiy" belgisi).

### 3-talab: Do'kon ochish va do'kon mahsulotlari

**Foydalanuvchi hikoyasi:** Sotuvchi sifatida do'kon ochmoqchiman, toki barcha mahsulotlarim bir profil ostida ko'rinsin.

**Qabul mezonlari:**
1. Foydalanuvchi do'kon profili yaratishi KERAK: nom, logo, banner, tavsif, manzil, ish vaqti, aloqa.
2. Do'kon egasi mahsulot qo'sha olishi KERAK (e'lon bilan o'xshash, lekin do'konga bog'langan).
3. Do'kon mahsulotlari do'kon profili sahifasida ko'rinishi KERAK.
4. Tizim do'kon mahsulotlarida "Do'kon/Tasdiqlangan" belgisini ko'rsatishi KERAK.
5. Obuna tarifiga qarab tizim mahsulot sonini cheklashi KERAK (Boshlang'ich/Standart/Premium).

### 4-talab: Qidiruv va filtrlar

**Foydalanuvchi hikoyasi:** Xaridor sifatida kerakli mahsulotni tez topmoqchiman.

**Qabul mezonlari:**
1. Foydalanuvchi kalit so'z bo'yicha qidira olishi KERAK.
2. Tizim filtrlash imkonini berishi KERAK: kategoriya (ierarxik), narx oralig'i, hudud, **e'lon turi (Do'kon / Shaxsiy)** va **holat (Yangi / Ishlatilgan)** — bular alohida va aniq filtrlar bo'lishi KERAK.
3. Tizim saralash imkonini berishi KERAK: yangiligi, narx (o'sish/kamayish).
4. Qidiruv natijalari kartochka ko'rinishida (rasm, narx, sarlavha, joylashuv, **tur belgisi**) ko'rsatilishi KERAK.
5. Natija bo'lmasa, tizim bo'sh holat (empty state) ko'rsatishi KERAK.
6. Do'kon e'lonlari va shaxsiy e'lonlar natijalarda vizual ajralib turishi KERAK; yangi va ishlatilgan mahsulotlar aralashmasligi uchun foydalanuvchi holat bo'yicha tezkor filtr ko'ra olishi KERAK.

### 5-talab: Mahsulot/e'lon batafsil sahifasi

**Foydalanuvchi hikoyasi:** Xaridor sifatida mahsulot haqida to'liq ma'lumot ko'rib, sotuvchiga bog'lanmoqchiman.

**Qabul mezonlari:**
1. Sahifa rasmlar galereyasi, narx, sarlavha, tavsif, holat, joylashuv va sotuvchi ma'lumotini ko'rsatishi KERAK.
2. Sahifa "Xabar yozish (chat)" va "Bog'lanish (telefon)" tugmalarini ko'rsatishi KERAK.
3. Login qilmagan foydalanuvchi chat/bog'lanishni bossa, tizim login so'rashi KERAK.
4. Sahifa ko'rishlar sonini hisoblashi KERAK (statistika uchun).
5. Foydalanuvchi e'lonni sevimlilarga qo'sha olishi va shikoyat qila olishi KERAK.

### 6-talab: Chat (aloqa)

**Foydalanuvchi hikoyasi:** Xaridor sifatida sotuvchi bilan ilova ichida yozishmoqchiman.

**Qabul mezonlari:**
1. Foydalanuvchi mahsulot sahifasidan sotuvchiga chat boshlay olishi KERAK.
2. Tizim xabarlarni real vaqtda (yoki tezkor yangilanish bilan) ko'rsatishi KERAK.
3. Chat ro'yxati oxirgi xabar va o'qilmagan belgisini ko'rsatishi KERAK.
4. Foydalanuvchi suhbatdoshni bloklash yoki shikoyat qila olishi KERAK.
5. Chatda qaysi mahsulot haqida ekani (e'lon kartochkasi) ko'rinishi KERAK.

### 7-talab: Sevimlilar

**Qabul mezonlari:**
1. Login qilgan foydalanuvchi e'lon/mahsulotni sevimlilarga qo'sha va olib tashlay olishi KERAK.
2. Tizim sevimlilar ro'yxatini alohida ekranda ko'rsatishi KERAK.

### 8-talab: Do'kon statistikasi

**Foydalanuvchi hikoyasi:** Do'kon egasi sifatida mahsulotlarim qanchalik ko'rilayotganini bilmoqchiman.

**Qabul mezonlari:**
1. Tizim do'kon uchun umumiy ko'rsatkichlarni ko'rsatishi KERAK: ko'rishlar, bog'lanishlar (chat), sevimlilar.
2. Statistika kunlik/haftalik ko'rinishda bo'lishi KERAK.
3. Har bir mahsulot uchun ko'rishlar soni ko'rsatilishi KERAK.

### 9-talab: Obuna tariflari

**Foydalanuvchi hikoyasi:** Sotuvchi sifatida do'kon tariflarini ko'rib, mosini tanlamoqchiman.

**Qabul mezonlari:**
1. Tizim 3 ta tarifni ko'rsatishi KERAK: Boshlang'ich (~49k), Standart (~99k), Premium (~199k so'm/oy).
2. Har bir tarif imkoniyatlari (mahsulot soni, statistika darajasi) ko'rsatilishi KERAK.
3. Tizim to'lov usullarini (Payme/Click/Uzum) ko'rsatishi KERAK. (MVP'da to'lov stub bo'lishi MUMKIN, integratsiya keyin.)
4. Obuna holati (faol/muddati) do'kon panelida ko'rinishi KERAK.

### 10-talab: Shikoyat va moderatsiya (asosiy)

**Qabul mezonlari:**
1. Foydalanuvchi e'lon, do'kon yoki foydalanuvchi haqida shikoyat yubora olishi KERAK (sabab bilan).
2. Tizim shikoyatlarni saqlashi va admin ko'rishi uchun belgilashi KERAK.
3. Tizim taqiqlangan so'zlar/spam uchun oddiy avto-tekshiruv qo'llashi MUMKIN.

### 11-talab: Mahalliylashtirish

**Qabul mezonlari:**
1. Interfeys O'zbek (lotin) tilida bo'lishi KERAK; Rus va kirill qo'shilishi MUMKIN.
2. Narxlar so'm formatida (masalan "1 200 000 so'm") ko'rsatilishi KERAK.
3. Hudud viloyat/tuman ierarxiyasida bo'lishi KERAK.
4. Telefon +998 formatda bo'lishi KERAK.

### 12-talab: Kategoriya tizimi

**Foydalanuvchi hikoyasi:** Foydalanuvchi sifatida mahsulotlarni keng va aniq kategoriyalar bo'yicha tez topmoqchiman.

**Qabul mezonlari:**
1. Tizim **ierarxik** (asosiy kategoriya → kichik kategoriya) kategoriyalarni qo'llab-quvvatlashi KERAK.
2. Kategoriyalar keng va aniq bo'lishi KERAK (masalan: Qurilish mollari, Maishiy texnika, Elektronika, Oziq-ovqat, Poliz/dehqonchilik, Kiyim-kechak → Ayollar/Erkaklar/Bolalar, Transport, Uy-ro'zg'or va h.k.).
3. Kiyim kabi kategoriyalar jins/yosh bo'yicha alohida kichik kategoriyalarga bo'linishi KERAK (Ayollar / Erkaklar / Bolalar).
4. Har bir e'lon kamida bitta aniq (eng quyi) kategoriyaga biriktirilishi KERAK.
5. Kategoriya ro'yxati tartibli va kengaytiriladigan bo'lishi KERAK (yangi kategoriya admin tomonidan qo'shiladi).
6. To'liq kategoriya tuzilishi loyiha hujjatida (RASTA_Kategoriyalar.md) belgilanadi.

---

### 13-talab: 3D / AR mahsulot ko'rinishi (Premium imkoniyat)

**Foydalanuvchi hikoyasi:** Xaridor sifatida mahsulotni 3D'da har tomondan ko'rmoqchiman va AR orqali uni o'z xonamda sinab ko'rmoqchiman; sotuvchi sifatida do'konimni boshqalardan ajratmoqchiman.

**Qabul mezonlari:**
1. Tizim mahsulotga 3D model (GLB/GLTF) biriktirishni qo'llab-quvvatlashi KERAK (Premium do'konlar uchun).
2. Mahsulot sahifasida 3D model 360° aylantirib ko'riladigan bo'lishi KERAK (Google model-viewer).
3. Qo'llab-quvvatlovchi qurilmalarda AR rejimi (Android Scene Viewer, iOS Quick Look, WebXR) mavjud bo'lishi KERAK.
4. 3D modeli bor mahsulotlar katalogda "3D" belgisi bilan ajralib turishi KERAK.
5. Sotuvchi do'kon panelidan 3D modelni yuklashi va boshqarishi KERAK.
6. 3D bo'lmagan mahsulotlar oddiy rasm galereyasi bilan ishlashda davom etishi KERAK (3D ixtiyoriy).

> Eslatma: 3D/AR — premium/farqlovchi imkoniyat. MVP'da interfeys va demo, to'liq integratsiya v3 bosqichida (mebel, texnika kabi kategoriyalar uchun avval).

## MVP bo'lmagan (kelajak)
- Xarita/geolokatsiya, kengaytirilgan filtr
- Premium statistika (geografiya, konversiya)
- To'lov to'liq integratsiyasi va avto-yangilanish
- Admin moderatsiya web-paneli
- AI tavsiya, rasm orqali qidiruv, Telegram Mini App, mobil (Flutter)
