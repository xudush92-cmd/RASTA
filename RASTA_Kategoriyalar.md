# RASTA — Kategoriyalar tizimi (universal bozor)

> RASTA — **universal savdo rastasi**: mahsulot, xizmat, ko‘chmas mulk, oziq-ovqat, dori-darmon, ish o‘rni va boshqalar bitta ilovada, lekin **aniq ajratilgan** holda.
> Tuzilish: **Asosiy kategoriya → Kichik kategoriya → (kerak bo‘lsa) uchinchi daraja**. Har bir e'lon eng quyi (aniq) kategoriyaga biriktiriladi.
> **Kategoriya aniqligi — platformaning asosiy sifat mezoni.** Noto‘g‘ri kategoriya moderatsiyada tuzatiladi yoki rad etiladi.

---

## 0. E'lon turi (listing_type) — eng muhim ajratish

Kategoriyadan oldin har bir e'lon **turi** aniqlanadi. Tur formani, atributlarni, filtrlarni va ko‘rinishni belgilaydi:

| Tur | Misol | Xususiyati |
|-----|-------|-----------|
| 🛍️ **Mahsulot** | telefon, kiyim, mebel | narx, **holat (yangi/ishlatilgan)**, qoldiq/SKU |
| 🛠️ **Xizmat** | usta, repetitor, tozalash | narx turi (soatbay/ish hajmi/kelishiladi), tajriba, xizmat hududi — *qoldiq/holat yo‘q* |
| 🏡 **Ko‘chmas mulk** | kvartira, uy, ofis | sotuv/ijara, xona, maydon (m²), qavat — *qoldiq yo‘q* |
| 🍎 **Oziq-ovqat** | asal, go‘sht, mevalar | birlik/og‘irlik, yaroqlilik muddati, ishlab chiqaruvchi |
| 💊 **Dori-darmon** | vitamin, dori, tibbiy mol | doza, ishlab chiqaruvchi, **retsept holati** (litsenziya majburiy) |
| 💼 **Ish o‘rni (vakansiya)** | sotuvchi, haydovchi | ish turi, maosh oralig‘i, band bo‘lish — *narx/holat yo‘q* |

> **Muhim:** `yangi/ishlatilgan` **holat** faqat **mahsulot** turida bor. Xizmat, ko‘chmas mulk va vakansiyada bu maydon ko‘rsatilmaydi — forma har turga moslashadi.

E'lon egaligi ham ajratiladi:

| Belgi | Variantlar |
|-------|-----------|
| **Egalik** | 🏪 Do‘kon e'loni (tasdiqlangan) · 👤 Shaxsiy e'lon |
| **Reklama** | organik natija · «Reklama» yorlig‘i bilan pullik joylashuv |

---

## 1. 📱 Elektronika
- Telefonlar va aksessuarlar
- Kompyuter va noutbuklar
- Planshetlar
- Televizor va monitorlar
- Audio: quloqchin, kolonka
- Foto va video texnika
- Smart soat va gadjetlar
- O‘yin konsollari (PlayStation, Xbox)
- Kompyuter ehtiyot qismlari

## 2. 🔌 Maishiy texnika
- Muzlatgich
- Kir yuvish mashinasi
- Konditsioner va isitgich
- Oshxona texnikasi (plita, pech, mikroto‘lqinli)
- Changyutgich
- Suv isitgich (boyler)
- Dazmol va mayda texnika
- Idish yuvish mashinasi

## 3. 🏗️ Qurilish mollari
- Bo‘yoq va lak
- Sement, gips, qurilish aralashmalari
- G‘isht, bloklar, shifer
- Elektr mollari (kabel, rozetka, lampalar)
- Santexnika (truba, kran, smesitel)
- Eshik va derazalar
- Pol qoplamalari (laminat, plitka, linoleum)
- Asboblar (drel, bolg‘a, shurupavert)
- Issiqlik va izolatsiya materiallari

## 4. 👕 Kiyim-kechak
- 👩 Ayollar kiyimlari
- 👨 Erkaklar kiyimlari
- 🧒 Bolalar kiyimlari (qiz/o‘g‘il, chaqaloq)
- 👟 Poyabzal
- 👜 Sumka va aksessuarlar
- ⌚ Soat va zargarlik
- 🧣 Bosh kiyim, sharf, qo‘lqop

## 5. 🍎 Oziq-ovqat
- Go‘sht va parranda
- Sut mahsulotlari
- Non va shirinliklar
- Quruq mevalar va yong‘oqlar
- Asal va murabbo
- Ziravorlar va qadoqlangan mahsulotlar
- Ichimliklar
> Atribut: birlik, og‘irlik/hajm, yaroqlilik muddati, ishlab chiqaruvchi, tarkib.

## 6. 🌽 Poliz va dehqonchilik
- Poliz mahsulotlari (tarvuz, qovun, qovoq)
- Mevalar
- Sabzavotlar
- Ko‘katlar
- Don va urug‘lik
- Ko‘chat va o‘simliklar
- Yem-xashak

## 7. 🚗 Transport
- Yengil avtomobillar
- Mototsikl va skuter
- Velosiped va elektr velosiped
- Yuk mashinalari va maxsus texnika
- Avto ehtiyot qismlar
- Avto aksessuarlar
- Shina va disklar
> Atribut: marka, model, yil, probeg, yoqilg‘i, uzatmalar qutisi.

## 8. 🛋️ Uy-ro‘zg‘or va mebel
- Divan va yumshoq mebel
- Stol va stullar
- Karavot va matras
- Shkaf va javonlar
- Oshxona mebeli
- Bog‘ va dala mebeli
- Gilam va to‘shamalar
- Idish-tovoq
- Dekor

## 9. 💄 Go‘zallik va parvarish
- Parfyumeriya
- Dekorativ kosmetika
- Yuz va tana parvarishi
- Soch parvarishi
- Sport ozuqasi

## 10. 💊 Apteka va dori-darmon
- Dori vositalari (retseptsiz)
- Vitamin va biologik faol qo‘shimchalar (BAD)
- Tibbiy mollar (bint, shpris, maska, tonometr)
- Ona va bola mahsulotlari (tibbiy)
- Ortopediya va parvarish vositalari
- Optika (ko‘zoynak, linza)
> **Majburiy:** faqat **litsenziyalangan apteka** do‘konlari joylashtira oladi.
> Atribut: ishlab chiqaruvchi, doza/miqdor, yaroqlilik muddati, **retsept holati**.
> **Taqiqlangan:** retsept talab qiladigan/nazorat ostidagi dorilar, notarkibiy va soxta vositalar — Trust & Safety siyosati bo‘yicha bloklanadi.

## 11. 🧸 Bolalar mollari
- O‘yinchoqlar
- Bolalar aravachalari
- Bolalar mebeli (beshik, stul)
- Chaqaloq mollari (tagliklar, idishlar)
- Maktab va o‘quv anjomlari

## 12. ⚽ Sport va dam olish
- Sport anjomlari va trenajyorlar
- Velosiped (sport)
- Turizm va kemping
- Baliq ovi va ov
- Sport kiyimlari

## 13. 📚 Hobbi va bo‘sh vaqt
- Kitoblar
- Musiqa asboblari
- San'at va kolleksiyalar
- Antikvariat
- Qo‘lda yasalgan buyumlar

## 14. 🐈 Hayvonlar
- Uy hayvonlari (it, mushuk)
- Qushlar
- Akvarium va baliqlar
- Hayvonlar uchun yem va aksessuar
- Chorva mollari

## 15. 🏡 Ko‘chmas mulk
- Kvartiralar (sotuv / ijara)
- Uy va hovlilar
- Yer uchastkalari
- Tijorat ob'ektlari (do‘kon, ofis, ombor)
- Garaj va dachalar
> Atribut: sotuv/ijara, xonalar soni, maydon (m²), qavat/qavatlar, ta'mir holati, hujjat.

## 16. 🛠️ Xizmatlar va ustalar
- **Ta'mirlash va montaj:** santexnik, elektrik, konditsioner ustasi, mebel yig‘uvchi
- **Qurilish ishchilari:** g‘isht teruvchi, suvoqchi, bo‘yoqchi, kafelchi
- **Uy xizmatlari:** tozalash, kir yuvish, ko‘chirish (gruzchik)
- **Transport va yetkazish:** yuk tashish, taksi, evakuator
- **Ta'lim:** repetitor, kurslar, murabbiy
- **Go‘zallik xizmatlari:** sartarosh, manikyur, kosmetolog (uyda/salonda)
- **IT va dizayn:** dasturlash, grafik dizayn, SMM
- **Tadbir:** fotograf, oshpaz, bezatish, boshlovchi
> Atribut: narx turi (soatbay / ish hajmi / kelishiladi), tajriba (yil), xizmat hududi, chaqiruv/uyga borish. *Holat va qoldiq yo‘q.*

## 17. 💼 Ish va biznes
- Ish o‘rinlari (vakansiya)
- Tayyor biznes
- Biznes uskunalari
- Ofis jihozlari
> Vakansiya atributi: lavozim, band bo‘lish (to‘liq/qisman), maosh oralig‘i, tajriba talabi.

---

## Kategoriyaga mos dinamik atributlar (aniqlik uchun)

| Kategoriya / tur | Majburiy atributlar | Ixtiyoriy |
|---|---|---|
| Telefon | brend, model, xotira, holat | rang, SIM, kafolat |
| Kiyim | jins/yosh, o‘lcham, material | rang, mavsum |
| Oziq-ovqat | birlik, og‘irlik/hajm, yaroqlilik | ishlab chiqaruvchi, tarkib |
| Dori-darmon | ishlab chiqaruvchi, doza, retsept holati | miqdor, yaroqlilik |
| Ko‘chmas mulk | sotuv/ijara, xona, maydon (m²), qavat | ta'mir, mebel, hujjat |
| Xizmat / usta | xizmat turi, narx turi, hudud | tajriba, chaqiruv |
| Transport | marka, model, yil, probeg | yoqilg‘i, rang |
| Qurilish | material/tur, o‘lcham, birlik | marka, standart |
| Vakansiya | lavozim, band bo‘lish, maosh oralig‘i | tajriba, jadval |

Admin atribut ta'rifini boshqaradi. Sotuvchi faqat tanlangan kategoriya/tur uchun berilgan maydonlarni ko‘radi — shu bilan forma qisqa, aniq va turli bozorlarga mos bo‘ladi.

## Media (rasm) qoidasi
- Har bir e'lon **bir nechta rasm** (galereya) qabul qiladi.
- Kartada va batafsil sahifada rasmlar **avtomatik slayd** bo‘ladi (har ~5 soniyada) hamda qo‘lda suriladi; nuqta (dot) indikatori ko‘rsatiladi.
- Birinchi rasm — asosiy (muqova); tartib sotuvchi tomonidan belgilanadi.

## Kengaytirish
- Kategoriyalar va atributlar admin paneli orqali qo‘shiladi/tahrirlanadi.
- Yangi bozor turi (masalan, «yo‘qolgan buyumlar», «ijaraga texnika») kod o‘zgartirmasdan, kategoriya + atribut shabloni orqali qo‘shiladi.
