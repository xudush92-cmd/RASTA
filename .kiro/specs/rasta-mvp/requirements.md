# RASTA MVP — Talablar (Requirements)

## Kirish

RASTA — butun O'zbekiston uchun onlayn bozor (katalog-marketplace). Ilova ichida xaridor-sotuvchi to'lovi yo'q: sotuvchilar do'kon ochib mahsulot joylaydi, xaridor qidirib topadi va chat/telefon orqali bog'lanadi.

E'lonlar ikki turda va aniq ajratilgan bo'ladi: **Do'kon mahsuloti** (ro'yxatdan o'tgan va tasdiqlangan do'konlar; pilotda trial/manual entitlement, pullik obuna P1) va **Shaxsiy e'lon** (bepul, yakka shaxslar). Yangi va ishlatilgan mahsulotlar ham doimo ajratiladi.

Ushbu hujjat **MVP (birinchi ishlaydigan versiya)** uchun talablarni belgilaydi. MVP web (Next.js) ko'rinishidan boshlanadi.

### MVP doirasi (Scope)
- ✅ Telefon (OTP) orqali ro'yxatdan o'tish/kirish
- ✅ Shaxsiy e'lon joylash (bepul)
- ✅ Do'kon ochish/tekshirish va do'kon mahsulotlari (pilot trial/manual entitlement)
- ✅ Keng, ierarxik kategoriya tizimi
- ✅ Qidiruv va filtrlar (tur va holat ajratilgan)
- ✅ Mahsulot/e'lon batafsil sahifasi
- ✅ Chat (sotuvchi bilan aloqa)
- ✅ Sevimlilar
- ✅ Oddiy do'kon statistikasi
- ✅ Pilot entitlementi va limit holati; real obuna/to'lov P1
- ✅ Shikoyat (report) tizimi
- ✅ Asosiy admin moderatsiya paneli (do'kon/e'lon/shikoyat)
- ❌ MVP'dan tashqari: xarita, AI tavsiya, video, mikroservis, 3D/AR

---

## Talablar

### 1-talab: Autentifikatsiya (OTP)

**Foydalanuvchi hikoyasi:** Foydalanuvchi sifatida telefon raqamim orqali tez ro'yxatdan o'tmoqchiman, toki e'lon joylash va sotuvchi bilan bog'lanish mumkin bo'lsin.

**Qabul mezonlari:**
1. Foydalanuvchi telefon raqamini (+998 formatda) kiritsa, tizim SMS orqali OTP kod yuborishi KERAK.
2. To'g'ri OTP kiritilganda, tizim foydalanuvchini tizimga kiritishi va sessiya tokeni berishi KERAK.
3. Noto'g'ri yoki muddati o'tgan OTP kiritilganda, tizim xatolik ko'rsatishi KERAK.
4. Foydalanuvchi birinchi marta kirganda, tizim ismni so'rashi KERAK; xaridor/sotuvchi qaytmas rol tanlovi so'ralmasligi KERAK, chunki bitta akkaunt ikkala kontekstda ishlaydi.
5. Tizim mehmon (login'siz) rejimida ko'rish va qidiruvga ruxsat berishi KERAK; e'lon joylash yoki chat uchun login talab qilishi KERAK.
6. OTP so'rovlari uchun tizim rate limiting qo'llashi KERAK (spam/SMS-pumping himoyasi).

### 2-talab: Shaxsiy e'lon joylash (bepul)

**Foydalanuvchi hikoyasi:** Oddiy (yakka) foydalanuvchi sifatida bepul shaxsiy e'lon joylashtirmoqchiman, toki ortiqcha narsamni sota olay.

**Qabul mezonlari:**
1. Login qilgan foydalanuvchi e'lon formasini to'ldira olishi KERAK: rasm(lar), sarlavha, kategoriya, narx (yoki "Kelishiladi"), **holat (Yangi/Ishlatilgan — majburiy)**, hudud, tavsif, aloqa.
2. Tizim kamida 1 ta rasm va majburiy maydonlarni talab qilishi KERAK.
3. Shaxsiy e'lon uchun tizim rasm sonini cheklashi KERAK (masalan 5 tagacha).
4. E'lon yuborilganda, tizim uni `submitted` holatida saqlashi, moderatsiya boshlanganda `under_review`ga o'tkazishi KERAK; faqat muvaffaqiyatli tekshiruvdan keyin `active` bo'lishi va public qidiruvga chiqishi KERAK.
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
5. P0 da tizim trial/manual entitlement bo'yicha mahsulot sonini cheklashi, P1 da shu limitni tanlangan tarif entitlementidan olishi KERAK.
6. Bitta foydalanuvchi bir yoki bir nechta do'konga `Owner`, `Manager`, `Catalog manager` yoki `Support` membershipi orqali bog'lanishi, faqat permissioni bor do'konni boshqarishi KERAK.
7. Do'kon mahsuloti `store_id` bilan, shaxsiy e'lon esa shaxsiy egasi bilan bog'lanishi va bu ikki egalik turi aralashmasligi KERAK.
8. Membership bekor qilinganda yoki permission pasaytirilganda, tizim yangi write/realtime amallarini darhol rad etishi va cached ruxsatni ko'pi bilan 60 soniyada yangilashi KERAK.
9. Parallel qoldiq yangilanishi atomik yoki versionlangan bo'lishi, idempotent retryni qo'llashi, manfiy qoldiq yaratmasligi va inventory movement yozishi KERAK.

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

### 9-talab: Pilot entitlementi va P1 obuna tariflari

**Foydalanuvchi hikoyasi:** Do'kon egasi sifatida pilotda do'konimning ruxsat va limitlarini ko'rmoqchiman; monetizatsiya ishga tushgach mos tarifni tanlamoqchiman.

**Qabul mezonlari:**
1. P0 pilotda tizim do'konga vaqtli trial yoki admin tomonidan manual entitlement berishi, do'kon ochishni real to'lovga bog'lamasligi KERAK.
2. Entitlement holati va mahsulot limiti do'kon panelida ko'rinishi KERAK.
3. P1 da tizim Boshlang'ich, Standart va Premium tariflarini hamda ularning aniq imkoniyatlarini ko'rsatishi KERAK.
4. P1 to'lov integratsiyasi signed/idempotent webhook va trial/grace/expired siyosati bilan alohida qabul qilinishi KERAK.

### 10-talab: Shikoyat va moderatsiya (P0)

**Qabul mezonlari:**
1. Foydalanuvchi e'lon, do'kon, foydalanuvchi yoki chat haqida sabab kodi va izoh bilan shikoyat yubora olishi KERAK.
2. Tizim yangi do'kon va listingni public qilishdan oldin moderator navbatiga yuborishi KERAK.
3. Moderator obyektni tasdiqlashi, sabab kodi bilan rad etishi, qo'shimcha ma'lumot so'rashi yoki suspend qilishi KERAK.
4. Rad etish/takedown natijasi sotuvchiga tushunarli ko'rsatilishi va apellyatsiya yuborish imkoniyati bo'lishi KERAK.
5. Moderatsiya, bloklash va qayta faollashtirish qarorlari actor, vaqt, sabab va target bilan audit jurnaliga yozilishi KERAK.
6. Suspend qilingan do'kon yoki listing public qidiruv, direct URL va CDN cachedan ko'pi bilan 60 soniyada yashirilishi KERAK; purge muvaffaqiyatsiz bo'lsa origin public o'qishni rad etishi KERAK.
7. Tizim taqiqlangan so'zlar, spam va duplicate signallari uchun avtomatik risk tekshiruvini qo'llashi MUMKIN; yakuniy qaror izohlanadigan bo'lishi KERAK.

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

## MVP bo'lmagan (kelajak)
- Xarita/geolokatsiya va kengaytirilgan filtr
- Premium statistika (geografiya va chuqur funnel tahlili)
- To'lovning to'liq integratsiyasi va avto-yangilanish
- AI tavsiya, rasm orqali qidiruv, Telegram Mini App va native mobil ilova

> **Qat'iy doiradan tashqari:** 3D model va AR funksiyalari ishlab chiqilmaydi.
