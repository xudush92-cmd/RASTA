# RASTA — haqiqiy ishlaydigan ilova

Universal katalog-marketplace: mahsulot, ko'chmas mulk, avtomobil, xizmat, apteka va oziq-ovqat
bitta platformada, lekin aniq ajratilgan holda.

**Ilovada to'lov tizimi yo'q.** RASTA — katalog, discovery va aloqa vositasi. Savdo va pul masalasi
xaridor bilan sotuvchi o'rtasida platformadan tashqarida hal qilinadi.

## Ishga tushirish

Talab: **Node.js 22.5+** (boshqa hech narsa kerak emas — tashqi kutubxona ishlatilmaydi).

```bash
cd app
npm run seed      # namuna ma'lumotlar (kategoriya, do'kon, e'lonlar)
npm start         # http://localhost:3000
```

Boshqa buyruqlar:

```bash
npm run reset     # bazani tozalab qayta to'ldirish
npm test          # uchidan-uchiga tekshiruv (33 ta test)
PORT=8080 npm start
```

## Sinov uchun hisoblar

Parol hammasida: `parol123`

| Email | Rol | Nima ko'radi |
|---|---|---|
| `admin@rasta.uz` | Super admin | Moderatsiya, kategoriya CRUD, foydalanuvchilar, audit log |
| `sardor@rasta.uz` | Sotuvchi | TexnoMart kabineti, e'lon joylash va tahrirlash |
| `dilnoza@mail.uz` | Xaridor | Feed, qidiruv, saqlangan, obuna, xabarlar |

## Nima ishlaydi

**Xaridor**
- Rasmli kategoriyalar bo'yicha feed; ichki filtr (masalan Ko'chmas mulk → Sotuv / Ijara)
- Qidiruv: sarlavha, tavsif, **kalit so'zlar**, do'kon nomi va kategoriya bo'yicha
- E'lon batafsil sahifasi: rasm galereyasi (5 soniyada avtomatik slayd + qo'lda surish),
  turga mos atributlar, sotuvchi tavsifi, sharhlar, o'xshash e'lonlar
- Saqlash, yoqtirish, do'konga obuna va **alohida qo'ng'iroqcha** (bildirishnoma)
- Sotuvchi bilan chat, shikoyat yuborish

**Sotuvchi**
- Do'kon ochish, kabinet: bugungi vazifalar, KPI, so'nggi e'lonlar
- **Turga moslashuvchi e'lon formasi**: mahsulot / ko'chmas mulk / avtomobil / xizmat —
  har biriga mos maydonlar (m², xona, yil, probeg, tajriba, hudud...)
- Rasm yuklash (bir nechta), qoralama saqlash, tahrirlash, o'chirish
- E'lon holatlari: qoralama → tekshiruvda → faol / rad etilgan

**Super admin**
- Moderatsiya navbati: tasdiqlash yoki sabab bilan rad etish
- Kategoriya CRUD (ichki bo'limlar bilan) — o'zgarish darhol mijoz ilovasida ko'rinadi
- Do'konlarni tasdiqlash/bloklash, foydalanuvchilarni bloklash, shikoyatlar
- **Audit log**: kim, qachon, nima o'zgartirgani (IP bilan)

## Arxitektura

```
app/
  src/
    server.js        HTTP server va marshrutlash
    db.js            SQLite ulanish, tranzaksiya, audit
    schema.sql       16 jadval
    auth.js          scrypt parol, sessiya, rollar
    http.js          form/multipart parsing, cookie, HTML ekranlash
    queries.js       barcha SQL so'rovlar
    ui.js            sahifa shabloni, ikonka, illyustratsiya
    seed.js          namuna ma'lumotlar
    pages/           buyer.js, seller.js, admin.js
  public/            styles.css, app.js
  data/              SQLite bazasi va yuklangan rasmlar (git'ga kirmaydi)
  test/smoke.js      uchidan-uchiga tekshiruv
```

**Nega framework yo'q:** ishlab chiqish muhitida npm registry yopiq edi, shuning uchun ilova
Node.js standart kutubxonasi (`node:http`, `node:sqlite`, `node:crypto`) ustiga qurildi.
Bu ishlab chiqarishga tayyor bo'lmasa ham, to'liq ishlaydigan haqiqiy ilova beradi va keyinchalik
Next.js/PostgreSQL ga ko'chirish uchun ma'lumot modeli va oqimlar tayyor bo'ladi.

## Xavfsizlik

Amalga oshirilgan: parol `scrypt` bilan xeshlanadi, sessiya HttpOnly cookie'da, barcha
foydalanuvchi matni HTML'da ekranlanadi (XSS), SQL faqat parametrlangan so'rovlar orqali,
rasm yuklashda tur va hajm tekshiriladi, fayl nomi UUID bilan almashtiriladi (path traversal yopiq),
rollar server tomonida tekshiriladi, admin amallari audit logga yoziladi.

Ishlab chiqarishga chiqarishdan oldin qo'shilishi kerak: CSRF token, rate limiting, HTTPS,
2FA va admin uchun alohida domen/IP cheklovi, rasm qayta ishlash (resize/EXIF tozalash),
PostgreSQL ga ko'chish va zaxira nusxa.
