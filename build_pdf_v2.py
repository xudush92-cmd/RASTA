#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
RASTA - To'liq loyiha rejasi v2 (mutaxassislar takliflari bilan).
build_pdf.py dagi PDF dvigatelidan foydalanadi.
"""
from build_pdf import PDF, NAVY, ACCENT, GRAY, DARK, PH, ML

def main():
    p = PDF()
    p.title("RASTA", "Butun O'zbekiston uchun onlayn bozor (katalog-marketplace)")

    # 0. Hujjat haqida
    p.h1("Hujjat haqida")
    p.para("Ushbu hujjat - RASTA ilovasining to'liq loyihalashtirish rejasi (v2). "
           "U to'rt yo'nalish bo'yicha mutaxassis tahlillarini jamlaydi: UI/UX dizayn, "
           "mahsulot menejmenti, tizim arxitekturasi va xavfsizlik (Trust & Safety). "
           "Hujjat texnik jamoa, dizayner va investorlar uchun yagona ma'lumotnoma "
           "vazifasini bajaradi.")

    # 1. Konsepsiya
    p.h1("1. Loyiha konsepsiyasi")
    p.para("RASTA - butun O'zbekiston uchun raqamli bozor. Nomi bozordagi savdo qatori "
           "(rasta) ma'nosini bildiradi: har bir sotuvchi o'z raqamli rastasini ochadi.")
    p.kv("Asosiy tamoyil", "ilova ichida xaridor-sotuvchi oldi-sotdisi (to'lov) YO'Q. "
         "Ilova katalog, do'kon profillari, qidiruv va aloqa vazifasini bajaradi.")
    p.kv("Ikki bo'lim", "(1) DO'KON E'LONI (pulli) - oylik obuna, keng boshqaruv paneli, batafsil "
         "statistika; (2) SHAXSIY E'LON (bepul) - yakka shaxslar uchun oddiy e'lon. Ular interfeys, "
         "huquq va monetizatsiyada ajratilgan. Yangi va ishlatilgan mahsulotlar ham doimo ajratiladi.")
    p.kv("Yagona to'lov", "ilovadagi yagona to'lov - DO'KON OBUNASI to'lovi (xaridorlar "
         "uchun emas). Bu Payme/Click/Uzum orqali amalga oshiriladi.")

    # 2. Foydalanuvchi rollari
    p.h1("2. Foydalanuvchi rollari")
    p.kv("Xaridor", "qidiradi, ko'radi, sevimlilarga saqlaydi, sotuvchi bilan chat/qo'ng'iroq. "
         "Login faqat bog'lanish paytida talab qilinadi (kam to'siq).")
    p.kv("Bepul sotuvchi", "cheklangan miqdorda shaxsiy e'lon joylaydi, oddiy ko'rsatkich.")
    p.kv("Do'kon egasi (pulli)", "do'kon ochadi, cheksiz mahsulot, keng boshqaruv paneli, "
         "batafsil statistika, boost, xodimlar.")
    p.kv("Admin / Moderator", "moderatsiya, verifikatsiya, shikoyatlar, bloklash, analitika.")

    # 3. Navigatsiya va menyular
    p.h1("3. Navigatsiya va menyular (Mahsulot menejeri)")
    p.h2("Pastki asosiy menyu (5 ta)")
    for b in [
        "Bosh sahifa - tavsiyalar, mashhur do'konlar, kategoriyalar",
        "Qidiruv - filtr, hudud, kategoriya, xarita",
        "Joylash (+) - markazda katta tugma: e'lon yoki mahsulot qo'shish",
        "Xabarlar - chat tarixi",
        "Profil / Kabinet - bepul foydalanuvchi yoki do'kon boshqaruvi",
    ]:
        p.bullet(b)
    p.h2("Yuqori panel")
    p.bullet("Joylashuv (viloyat/shahar) tanlash")
    p.bullet("Til almashtirish (O'zbek lotin / kirill / Rus)")
    p.bullet("Bildirishnomalar (qo'ng'iroqcha)")

    # 3.b Kategoriyalar va e'lon turlari
    p.h1("3.1 Kategoriyalar va e'lon turlari")
    p.para("Kategoriyalar keng, aniq va ierarxik (asosiy kategoriya -> kichik kategoriya). "
           "To'liq ro'yxat alohida hujjatda (RASTA_Kategoriyalar.md). Asosiy kategoriyalar:")
    for b in [
        "Elektronika; Maishiy texnika; Qurilish mollari",
        "Kiyim-kechak (Ayollar / Erkaklar / Bolalar), Poyabzal, Aksessuar",
        "Oziq-ovqat; Poliz va dehqonchilik mahsulotlari",
        "Transport; Uy-ro'zg'or va mebel; Go'zallik va salomatlik",
        "Bolalar mollari; Sport; Hayvonlar; Ko'chmas mulk; Xizmatlar; Ish va biznes",
    ]:
        p.bullet(b)
    p.h2("E'lon turi va holat - aniq ajratish")
    p.kv("E'lon turi", "(1) DO'KON E'LONI - pulli, tasdiqlangan do'konlar ('Do'kon ✓' belgisi); "
         "(2) SHAXSIY E'LON - yakka shaxslar, bepul ('Shaxsiy' belgisi). Qidiruvda alohida filtr.")
    p.kv("Holat", "har bir e'londa majburiy: YANGI yoki ISHLATILGAN. Qidiruvda alohida tab/filtr - "
         "yangi va ishlatilgan mahsulotlar aralashmaydi.")

    # 4. Do'kon boshqaruv paneli
    p.h1("4. Do'kon boshqaruv paneli (kengaytirilgan)")
    p.para("Pulli do'kon egasi uchun keng, qulay va tushunarli boshqaruv paneli "
           "(uch guruhga bo'lingan: Asosiy, Sotuv va marketing, Hisob va sozlamalar):")
    for b in [
        "Dashboard - umumiy ko'rsatkichlar va tezkor amallar bir ekranda",
        "Mahsulotlar - qo'shish, tahrirlash, holat (faol/pauza/tugagan)",
        "So'rovlar / Buyurtmalar - kelgan bog'lanish va so'rovlar (yangi/jarayon/yakun)",
        "Statistika / Analitika - batafsil grafiklar va hisobotlar",
        "Ombor / Qoldiq - mahsulot qoldig'i, kam/tugagan tovarlar nazorati",
        "Promokod / Aksiya - chegirma va kampaniyalar",
        "Boost / Reklama - e'lonni ko'tarish, TOP joylashuv, banner, highlight",
        "Xabarlar / Mijozlar - do'kon chatlari va mijozlar bazasi",
        "Sharhlar va reyting - mijoz sharhlariga javob berish",
        "Obuna va to'lovlar - joriy tarif, to'lov tarixi, yangilash",
        "Moliyaviy hisobot - daromad va kampaniya samaradorligi",
        "Do'kon sozlamalari - profil, logo, banner, ish vaqti, manzil",
        "Xodimlar / Rollar - bir nechta menejer qo'shish va huquqlar",
        "Yordam - murojaat va qo'llanma",
    ]:
        p.bullet(b)

    # 5. Statistika
    p.h1("5. Statistika ko'rsatkichlari (pulli do'kon qiymati)")
    p.h2("Asosiy (barcha tariflar)")
    for b in [
        "Ko'rishlar soni (kunlik / haftalik / oylik grafik)",
        "Qidiruvda nechi marta chiqqani",
        "Bog'lanishlar (chat / qo'ng'iroq) soni",
        "Sevimlilarga qo'shilishlar",
    ]:
        p.bullet(b)
    p.h2("Premium (yuqori tarif)")
    for b in [
        "Eng ko'p ko'rilgan TOP mahsulotlar",
        "Mijozlar geografiyasi (qaysi hududdan)",
        "Konversiya (ko'rish -> bog'lanish nisbati)",
        "Qaysi qidiruv so'zlari orqali topilgan",
    ]:
        p.bullet(b)

    # 6. Obuna tariflari
    p.h1("6. Obuna tariflari (Monetizatsiya)")
    p.table(
        ["Tarif", "Narx (taxminiy)", "Imkoniyatlar"],
        [["Boshlang'ich", "~49 000 so'm/oy", "Cheklangan mahsulot, asosiy statistika"],
         ["Standart", "~99 000 so'm/oy", "Ko'proq mahsulot, to'liq statistika, boost chegirma"],
         ["Premium", "~199 000 so'm/oy", "Cheksiz mahsulot, premium statistika, TOP joylashuv, xodimlar"]],
        [0.20, 0.26, 0.54])
    p.para("Qo'shimcha: yillik to'lovda chegirma, yangi do'konlar uchun bepul sinov muddati.",
           size=9.5, color=GRAY)
    p.h2("Qo'shimcha daromad manbalari")
    for b in [
        "Boost - e'lonni vaqtincha yuqoriga ko'tarish",
        "TOP joylashuv va banner reklama",
        "Highlight - e'lonni rangli ajratish",
        "Kategoriya homiyligi (sponsorlik)",
        "VIP do'kon maqomi",
    ]:
        p.bullet(b)

    # 7. UI/UX dizayn
    p.h1("7. UI/UX dizayn (Dizayner)")
    p.kv("Brending", "raqobatchilardan farqlanish uchun firuza/yashil asosiy rang (ishonch va savdo), "
         "issiq aksent CTA tugmasi, qorong'i rejim (dark mode).")
    p.kv("Dizayn tizimi", "token-asoslangan (rang, spacing, radius), qayta ishlatiluvchi "
         "mahsulot kartasi standarti, komponent kutubxonasi.")
    p.kv("Do'kon vs e'lon", "pulli do'konlarda 'Tasdiqlangan do'kon' nishonchasi, boost belgisi, "
         "qidiruvda ustunlik va ishonch signallari.")
    p.kv("Mobile-first", "thumb-zone, doimiy ko'rinadigan 'Bog'lanish' tugmasi, sekin internet "
         "optimizatsiyasi, kameradan to'g'ridan-to'g'ri rasm.")
    p.kv("Accessibility", "WCAG AA kontrast, 44px teginish maydoni, katta yoshli foydalanuvchilar uchun qulaylik.")
    p.kv("Statistika dashboard", "KPI kartalar, grafiklar, mahsulot jadvali, obuna holati, insights bloki.")
    p.kv("Qo'shimcha", "do'kon QR-kodi (offline -> onlayn ko'prik), saqlangan qidiruv bildirishnomasi, "
         "bo'sh holat (empty state) dizayni.")

    # 8. Texnologiya
    p.h1("8. Texnologiya steki va integratsiyalar (Arxitektor)")
    p.table(
        ["Qatlam", "Texnologiya"],
        [["Mobil ilova", "Flutter (Android + iOS)"],
         ["Web", "Next.js (SEO uchun muhim)"],
         ["Backend", "NestJS (Node.js) yoki Go"],
         ["Ma'lumotlar bazasi", "PostgreSQL + PostGIS (geolokatsiya)"],
         ["Qidiruv", "PostgreSQL FTS -> Meilisearch (geo, ranking)"],
         ["Rasm", "S3 / Cloudflare R2 + CDN + WebP"],
         ["Chat (realtime)", "WebSocket + Redis pub/sub"],
         ["Statistika", "Event tracking + ClickHouse / agregat jadvallar"],
         ["Kesh", "Redis"]],
        [0.30, 0.70])
    p.h2("O'zbekiston integratsiyalari")
    p.bullet("To'lov (obuna): Payme / Click / Uzum - webhook imzo tekshiruvi, idempotensiya")
    p.bullet("SMS (OTP): Eskiz.uz / Play Mobile")
    p.bullet("Push: Firebase Cloud Messaging; qo'shimcha: Telegram bot / Mini App")
    p.bullet("Xarita: Yandex Maps / 2GIS")
    p.h2("Arxitektura tamoyili")
    p.bullet("To'lov/obunani marketplace yadrosidan izolyatsiya qilish (adapter pattern)")
    p.bullet("Avval modulli monolit, keyin bosqichma-bosqich mikroservisga o'tish")
    p.bullet("Stateless backend, read replica, fon worker'lar (masshtablash)")

    # 9. Ma'lumotlar bazasi
    p.h1("9. Ma'lumotlar bazasi sxemasi (kengaytirilgan)")
    p.code([
        "users          (id, phone, name, role, status, created_at)",
        "shops          (id, owner_id, name, logo, banner, address,",
        "                lat, lng, region, working_hours, verified, rating)",
        "plans          (id, name, price, limits, features)",
        "subscriptions  (id, shop_id, plan_id, status, start_at, end_at)",
        "payments       (id, subscription_id, provider, amount, status,",
        "                external_id, created_at)",
        "categories     (id, parent_id, name, icon, slug)",
        "listings       (id, owner_id, shop_id, type[shop_product/free_ad],",
        "                category_id, title, description, price, currency,",
        "                status, expires_at, created_at)",
        "listing_images (id, listing_id, url, position)",
        "favorites      (id, user_id, listing_id)",
        "reviews        (id, shop_id, user_id, rating, comment, created_at)",
        "chats          (id, buyer_id, seller_id, listing_id)",
        "messages       (id, chat_id, sender_id, text, is_read, created_at)",
        "boosts         (id, listing_id, type, start_at, end_at)",
        "reports        (id, reporter_id, target_type, target_id, reason, status)",
        "events         (id, type, listing_id, user_id, created_at)  -- statistika",
    ])

    # 10. Xavfsizlik
    p.h1("10. Xavfsizlik va ishonch (Trust & Safety)")
    p.kv("Autentifikatsiya", "SMS/OTP, rate limiting, SMS-pumping himoyasi, ishonchli sessiya.")
    p.kv("Akkaunt himoyasi", "PIN/biometrika, yangi qurilma ogohlantirishi, step-up auth.")
    p.kv("Firibgar e'longa qarshi", "dublikat aniqlash, stop-so'zlar, narx anomaliyasi, velocity limit.")
    p.kv("Kontent moderatsiyasi", "avtomatik (risk-scoring) + qo'lda tekshiruv, audit log.")
    p.kv("Verifikatsiya", "do'kon uchun KYC/KYB (hujjat), bosqichli 'Tasdiqlangan' ishonch belgilari.")
    p.kv("Maxfiylik", "telefon raqamini yashirish, proksi qo'ng'iroq, rasmlardan EXIF tozalash, anti-scraping.")
    p.kv("To'lov xavfsizligi", "litsenziyali provayder, webhook imzosi, idempotentlik, PCI-DSS.")
    p.kv("Firibgarlikni aniqlash", "device fingerprint, risk-scoring, qora ro'yxat.")
    p.kv("Qonuniy jihatlar", "Foydalanish shartlari, Maxfiylik siyosati, O'zbekiston ma'lumot "
         "lokalizatsiya qonuni, taqiqlangan mahsulotlar ro'yxati.")

    # 11. Mahalliylashtirish
    p.h1("11. Mahalliylashtirish (O'zbekiston)")
    for b in [
        "Til: O'zbek lotin + kirill + Rus; lotin/kirill qidiruv transliteratsiyasi",
        "Narx: so'm formati (1 000 000 so'm)",
        "Hudud: viloyat -> tuman ierarxiyasi",
        "Telefon: +998 maska",
        "Mahalliy kategoriyalar va bozor odatlariga moslik",
    ]:
        p.bullet(b)

    # 12. MVP ustuvor funksiyalar
    p.h1("12. MVP uchun ustuvor funksiyalar")
    for b in [
        "SMS/OTP ro'yxatdan o'tish va kirish",
        "Do'kon profili va bepul e'lon joylash",
        "Mahsulot/e'lon qo'shish (rasm, narx, kategoriya)",
        "Qidiruv va asosiy filtrlar (hudud, kategoriya, narx)",
        "Chat (sotuvchi bilan aloqa)",
        "Sevimlilar",
        "Oddiy do'kon statistikasi (ko'rish, bog'lanish)",
        "Obuna to'lovi (kamida bitta provayder)",
        "Asosiy moderatsiya va shikoyat tizimi",
    ]:
        p.bullet(b)

    # 13. Yo'l xaritasi
    p.h1("13. Yo'l xaritasi")
    p.table(
        ["Bosqich", "Tarkib"],
        [["MVP (1-2 oy)", "Auth, do'kon/bepul e'lon, qidiruv, chat, oddiy statistika, obuna to'lovi"],
         ["v2", "Xarita/geolokatsiya, kengaytirilgan filtr, sharh/reyting, push, boost"],
         ["v3", "Premium statistika, admin moderatsiya, verifikatsiya (KYC), reklama"],
         ["v4", "AI tavsiya, rasm orqali qidiruv, Telegram Mini App, mikroservis, masshtablash"]],
        [0.22, 0.78])

    # 14. Kelajak g'oyalari
    p.h1("14. Kelajak g'oyalari")
    for b in [
        "AI tavsiyalar va shaxsiylashtirilgan lenta",
        "Rasm orqali qidiruv (fotosurat yuklab izlash)",
        "Video / Stories (do'kon e'lonlari)",
        "Telegram Mini App va PWA",
        "Ovozli qidiruv",
        "Optom / B2B bo'lim",
        "Yetkazib berish hamkorlari bilan integratsiya (ixtiyoriy)",
    ]:
        p.bullet(b)

    # 15. Manbalar
    p.h1("15. Manbalar")
    for s in [
        "developers.dev - classifieds marketplace blueprint",
        "ulansoftware.com - Marketplace arxitektura trendlari",
        "sharetribe.com - Marketplace developer yo'riqnomasi",
        "datavidhya.com - Two-sided marketplace data model",
        "meilisearch.com - Geo qidiruv va marketplace search",
        "getstream.io / cometchat.com - kontent moderatsiyasi",
        "rst.software - firibgarlikni aniqlash",
        "github.com/openclassify, osclass-classifieds.com - ochiq kod",
        "figma.com community - marketplace UI kitlar",
    ]:
        p.bullet(s, size=9.5)
    p.spacer(4)
    p.para("Eslatma: tashqi manbalardan olingan ma'lumotlar litsenziyaga rioya uchun qayta "
           "ifodalangan (rephrased). Mazkur hujjat to'rt mutaxassis agent tahlili asosida "
           "Kiro tomonidan tuzildi.", size=8.5, color=GRAY)

    size = p.build("/projects/sandbox/RASTA/RASTA_Loyiha_Rejasi_v2.pdf")
    print("PDF v2 yaratildi:", size, "bayt, sahifalar:", p.page_no)

if __name__ == "__main__":
    main()
