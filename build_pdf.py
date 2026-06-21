#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Sof Python PDF generator (tashqi kutubxonasiz).
"O'zbekiston Onlayn Bozor" loyiha rejasini professional PDF qilib chiqaradi.
"""

# ---- Helvetica AFM character widths (units / 1000 em) ----
HELV = {
    ' ':278,'!':278,'"':355,'#':556,'$':556,'%':889,'&':667,"'":191,'(':333,')':333,
    '*':389,'+':584,',':278,'-':333,'.':278,'/':278,'0':556,'1':556,'2':556,'3':556,
    '4':556,'5':556,'6':556,'7':556,'8':556,'9':556,':':278,';':278,'<':584,'=':584,
    '>':584,'?':556,'@':1015,'A':667,'B':667,'C':722,'D':722,'E':667,'F':611,'G':778,
    'H':722,'I':278,'J':500,'K':667,'L':556,'M':833,'N':722,'O':778,'P':667,'Q':778,
    'R':722,'S':667,'T':611,'U':722,'V':667,'W':944,'X':667,'Y':667,'Z':611,'[':278,
    '\\':278,']':278,'^':469,'_':556,'`':333,'a':556,'b':556,'c':500,'d':556,'e':556,
    'f':278,'g':556,'h':556,'i':222,'j':222,'k':500,'l':222,'m':833,'n':556,'o':556,
    'p':556,'q':556,'r':333,'s':500,'t':278,'u':556,'v':500,'w':722,'x':500,'y':500,
    'z':500,'{':334,'|':260,'}':334,'~':584,
}

def char_w(c, size, bold=False):
    w = HELV.get(c, 556)
    if bold:
        w = int(w * 1.06)
    return w / 1000.0 * size

def text_w(s, size, bold=False, mono=False):
    if mono:
        return len(s) * (600/1000.0) * size
    return sum(char_w(c, size, bold) for c in s)

# ---- sanitize to WinAnsi/ASCII-safe ----
REPL = {
    '\u2019':"'", '\u2018':"'", '\u201c':'"', '\u201d':'"',
    '\u2013':'-', '\u2014':'-', '\u2026':'...', '\u2022':'-',
    '\u2192':'->', '\u02bb':"'", '\u00a0':' ',
}
def sanitize(s):
    out = []
    for ch in s:
        if ch in REPL:
            out.append(REPL[ch]); continue
        o = ord(ch)
        if 32 <= o <= 126:
            out.append(ch)
        elif o in (0xE9,0xE8,0xE7,0xFC,0xF6,0xE4):  # a few latin1
            out.append(ch)
        else:
            # drop emoji / unknown
            pass
    return ''.join(out)

def esc(s):
    return s.replace('\\','\\\\').replace('(','\\(').replace(')','\\)')

# ---- Page geometry (A4) ----
PW, PH = 595.28, 841.89
ML, MR, MT, MB = 56, 56, 60, 56
CW = PW - ML - MR  # content width

# Colors
NAVY = (0.106, 0.208, 0.361)   # #1B355C
ACCENT = (0.0, 0.42, 0.71)     # blue
GRAY = (0.40, 0.40, 0.40)
LIGHT = (0.93, 0.95, 0.98)
CODEBG = (0.96, 0.96, 0.96)
DARK = (0.13, 0.13, 0.13)
LINEC = (0.80, 0.84, 0.90)

class PDF:
    def __init__(self):
        self.pages = []      # list of content byte strings
        self.cur = []        # current page ops
        self.y = PH - MT
        self.page_no = 0
        self._new_page(first=True)

    def _new_page(self, first=False):
        if self.cur:
            self.pages.append('\n'.join(self.cur))
        self.cur = []
        self.page_no += 1
        self.y = PH - MT
        if first:
            # header band
            self.rect(0, PH-110, PW, 110, NAVY, fill=True)
        else:
            self.rect(0, PH-34, PW, 34, NAVY, fill=True)
            self.y = PH - 34 - 24
        self._footer()

    def _footer(self):
        self.line(ML, MB-12, PW-MR, MB-12, LINEC)
        self._text("O'zbekiston Onlayn Bozor - Loyiha rejasi", ML, MB-26, 8, GRAY)
        num = "%d" % self.page_no
        self._text(num, PW-MR-text_w(num,8), MB-26, 8, GRAY)

    def check(self, need):
        if self.y - need < MB + 6:
            self._new_page()

    # ---- primitives ----
    def rect(self, x, y, w, h, color, fill=True):
        r,g,b = color
        if fill:
            self.cur.append("%.3f %.3f %.3f rg %.2f %.2f %.2f %.2f re f" % (r,g,b,x,y,w,h))
        else:
            self.cur.append("%.3f %.3f %.3f RG %.2f %.2f %.2f %.2f re S" % (r,g,b,x,y,w,h))

    def line(self, x1,y1,x2,y2,color,width=0.7):
        r,g,b = color
        self.cur.append("%.2f w %.3f %.3f %.3f RG %.2f %.2f m %.2f %.2f l S" % (width,r,g,b,x1,y1,x2,y2))

    def _text(self, s, x, y, size, color=DARK, bold=False, mono=False):
        font = 'F3' if mono else ('F2' if bold else 'F1')
        r,g,b = color
        self.cur.append("BT /%s %.2f Tf %.3f %.3f %.3f rg 1 0 0 1 %.2f %.2f Tm (%s) Tj ET"
                         % (font, size, r, g, b, x, y, esc(sanitize(s))))

    # ---- wrapping ----
    def wrap(self, s, size, maxw, bold=False, mono=False):
        s = sanitize(s)
        words = s.split(' ')
        lines, cur = [], ''
        for wd in words:
            trial = wd if cur=='' else cur+' '+wd
            if text_w(trial, size, bold, mono) <= maxw:
                cur = trial
            else:
                if cur: lines.append(cur)
                # hard-split very long word
                while text_w(wd, size, bold, mono) > maxw and len(wd) > 1:
                    cut = len(wd)
                    while cut>1 and text_w(wd[:cut], size, bold, mono) > maxw:
                        cut -= 1
                    lines.append(wd[:cut]); wd = wd[cut:]
                cur = wd
        if cur: lines.append(cur)
        return lines or ['']

    # ---- block writers ----
    def title(self, t, sub=''):
        # placed on header band
        self._text(t, ML, PH-58, 22, (1,1,1), bold=True)
        if sub:
            self._text(sub, ML, PH-82, 11, (0.80,0.86,0.95))
        self._text("Texnik loyihalashtirish hujjati", ML, PH-98, 9, (0.70,0.78,0.92))
        self.y = PH - 140

    def h1(self, t):
        self.check(48)
        self.y -= 14
        self.rect(ML, self.y-4, 4, 20, ACCENT, fill=True)
        self._text(t, ML+12, self.y, 15, NAVY, bold=True)
        self.y -= 8
        self.line(ML, self.y, PW-MR, self.y, LINEC, 0.8)
        self.y -= 16

    def h2(self, t):
        self.check(30)
        self.y -= 6
        self._text(t, ML, self.y, 12, ACCENT, bold=True)
        self.y -= 17

    def para(self, t, size=10.5, color=DARK, gap=4, indent=0):
        lead = size + 4.5
        for ln in self.wrap(t, size, CW-indent):
            self.check(lead)
            self._text(ln, ML+indent, self.y, size, color)
            self.y -= lead
        self.y -= gap

    def bullet(self, t, size=10.5):
        lead = size + 4.5
        bx = ML + 4
        tx = ML + 16
        lines = self.wrap(t, size, CW-16)
        for i, ln in enumerate(lines):
            self.check(lead)
            if i == 0:
                self.rect(bx, self.y+3, 4, 4, ACCENT, fill=True)
            self._text(ln, tx, self.y, size, DARK)
            self.y -= lead
        self.y -= 1

    def kv(self, key, val, size=10.5):
        # bold key, then wrapped value indented
        lead = size + 4.5
        self.check(lead)
        kw = text_w(key+': ', size, bold=True)
        self._text(key+':', ML+12, self.y, size, NAVY, bold=True)
        # value wrapped on remaining space, continued lines indent
        avail = CW - 12 - kw
        lines = self.wrap(val, size, avail)
        self._text(lines[0], ML+12+kw, self.y, size, DARK)
        self.y -= lead
        for ln in lines[1:]:
            self.check(lead)
            self._text(ln, ML+12+kw, self.y, size, DARK)
            self.y -= lead
        self.y -= 1

    def code(self, lines, size=8.6):
        lead = size + 3
        pad = 8
        # compute block height
        wrapped = []
        for ln in lines:
            ww = self.wrap(ln, size, CW-2*pad, mono=True) or ['']
            wrapped.extend(ww)
        h = len(wrapped)*lead + 2*pad
        self.check(h+6)
        top = self.y
        self.rect(ML, top-h+ (lead-size) , CW, h, CODEBG, fill=True)
        yy = top - pad - size + 2
        for ln in wrapped:
            self._text(ln, ML+pad, yy, size, (0.18,0.20,0.25), mono=True)
            yy -= lead
        self.y = top - h - 6

    def table(self, headers, rows, widths, size=9.5):
        # widths in fractions summing ~1
        cw = [CW*f for f in widths]
        pad = 5
        lead = size + 3
        def row_h(cells, bold=False):
            maxl = 1
            for i, c in enumerate(cells):
                wl = self.wrap(c, size, cw[i]-2*pad, bold=bold)
                maxl = max(maxl, len(wl))
            return maxl*lead + 2*pad
        # header
        hh = row_h(headers, bold=True)
        self.check(hh + 4)
        x = ML
        top = self.y
        self.rect(ML, top-hh, CW, hh, NAVY, fill=True)
        for i, c in enumerate(headers):
            lines = self.wrap(c, size, cw[i]-2*pad, bold=True)
            yy = top - pad - size + 2
            for ln in lines:
                self._text(ln, x+pad, yy, size, (1,1,1), bold=True)
                yy -= lead
            x += cw[i]
        self.y = top - hh
        # body rows
        shade = False
        for r in rows:
            rh = row_h(r)
            self.check(rh)
            top = self.y
            if shade:
                self.rect(ML, top-rh, CW, rh, LIGHT, fill=True)
            shade = not shade
            x = ML
            for i, c in enumerate(r):
                lines = self.wrap(c, size, cw[i]-2*pad)
                yy = top - pad - size + 2
                for ln in lines:
                    self._text(ln, x+pad, yy, size, DARK)
                    yy -= lead
                x += cw[i]
            # row bottom line
            self.line(ML, top-rh, PW-MR, top-rh, LINEC, 0.5)
            self.y = top - rh
        # vertical separators + outer border across the table is approximate; outer box:
        self.y -= 8

    def spacer(self, h=6):
        self.y -= h

    # ---- output ----
    def build(self, path):
        if self.cur:
            self.pages.append('\n'.join(self.cur))
        objs = []
        n_pages = len(self.pages)
        # object numbering:
        # 1 catalog, 2 pages, 3..(2+n) page objs, then content streams, then fonts
        page_obj_ids = [3+i for i in range(n_pages)]
        content_ids = [3+n_pages+i for i in range(n_pages)]
        f1 = 3+2*n_pages
        f2 = f1+1
        f3 = f2+1

        def obj(i, body):
            objs.append((i, body))

        obj(1, "<< /Type /Catalog /Pages 2 0 R >>")
        kids = ' '.join("%d 0 R" % pid for pid in page_obj_ids)
        obj(2, "<< /Type /Pages /Count %d /Kids [%s] >>" % (n_pages, kids))
        for i in range(n_pages):
            res = ("<< /Font << /F1 %d 0 R /F2 %d 0 R /F3 %d 0 R >> >>" % (f1,f2,f3))
            body = ("<< /Type /Page /Parent 2 0 R /MediaBox [0 0 %.2f %.2f] "
                    "/Resources %s /Contents %d 0 R >>" % (PW, PH, res, content_ids[i]))
            obj(page_obj_ids[i], body)
        for i in range(n_pages):
            stream = self.pages[i].encode('latin-1', 'replace')
            head = "<< /Length %d >>\nstream\n" % len(stream)
            objs.append((content_ids[i], head, stream))
        obj(f1, "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>")
        obj(f2, "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>")
        obj(f3, "<< /Type /Font /Subtype /Type1 /BaseFont /Courier /Encoding /WinAnsiEncoding >>")

        # serialize
        out = bytearray()
        out += b"%PDF-1.4\n%\xe2\xe3\xcf\xd3\n"
        offsets = {}
        # sort by id
        objs_sorted = sorted(objs, key=lambda x: x[0])
        for o in objs_sorted:
            oid = o[0]
            offsets[oid] = len(out)
            if len(o) == 2:
                out += ("%d 0 obj\n%s\nendobj\n" % (oid, o[1])).encode('latin-1')
            else:
                head = o[1]; stream = o[2]
                out += ("%d 0 obj\n" % oid).encode('latin-1')
                out += head.encode('latin-1')
                out += stream
                out += b"\nendstream\nendobj\n"
        xref_pos = len(out)
        max_id = max(offsets.keys())
        total = max_id + 1
        out += ("xref\n0 %d\n" % total).encode('latin-1')
        out += b"0000000000 65535 f \n"
        for i in range(1, total):
            if i in offsets:
                out += ("%010d 00000 n \n" % offsets[i]).encode('latin-1')
            else:
                out += b"0000000000 65535 f \n"
        out += ("trailer\n<< /Size %d /Root 1 0 R >>\nstartxref\n%d\n%%%%EOF\n"
                % (total, xref_pos)).encode('latin-1')
        with open(path, 'wb') as f:
            f.write(out)
        return len(out)


def main():
    p = PDF()
    p.title("O'zbekiston Onlayn Bozor", "Butun mamlakat uchun katalog-marketplace ilovasi (transaksiyasiz)")

    p.h1("1. Loyihaning umumiy tavsifi")
    p.para("Mazkur hujjat butun O'zbekiston uchun mo'ljallangan onlayn bozor ilovasining "
           "to'liq texnik loyihalashtirish rejasini taqdim etadi. Ilova bozorlar, "
           "supermarketlar va barcha turdagi sotuvchilar uchun yagona raqamli maydon "
           "bo'lib xizmat qiladi.")
    p.para("Asosiy tamoyil: ilova ichida oldi-sotdi (to'lov) AMALGA OSHIRILMAYDI. "
           "Ilova katalog, do'kon profillari, qidiruv va sotuvchi bilan aloqa vazifasini "
           "bajaradi. Xaridor mahsulotni topadi, so'ngra do'konga boradi yoki sotuvchi "
           "bilan to'g'ridan-to'g'ri kelishadi.")
    p.h2("Loyihaning afzalligi")
    p.bullet("To'lov tizimi bo'lmagani uchun eng murakkab va xavfli qism (escrow, karta, "
             "qaytarish) chiqib ketadi - rivojlantirish tezlashadi.")
    p.bullet("Yuridik va moliyaviy javobgarlik sezilarli kamayadi.")
    p.bullet("Asosiy e'tibor qulay qidiruv, ishonchli do'konlar va tez aloqaga qaratiladi.")

    p.h1("2. Bozor tahlili (referenslar)")
    p.table(
        ["Yo'nalish", "Nimani o'rganamiz"],
        [["E'lon platformalari", "C2C/B2C e'lon modeli, kategoriyalar, 'ko'tarish' (boost) monetizatsiyasi"],
         ["Hududiy bozorlar", "Soddalik va hududiy bo'linish, yuqori trafik"],
         ["Marketplace yechimlari", "Marketplace arxitekturasi va developer yo'riqnomalari"],
         ["Yetkazib berish ilovalari", "Do'kon profili, xarita va geolokatsiya UX tajribasi"]],
        [0.28, 0.72])
    p.para("Global classifieds bozori 2025-yilda taxminan 157 mlrd AQSh dollariga "
           "baholangan va o'sish ustuvor yo'nalish hisoblanadi.", size=9.5, color=GRAY)

    p.h1("3. Foydalanuvchi rollari (RBAC)")
    p.kv("Xaridor (Buyer)", "qidiradi, ko'radi, sevimlilarga saqlaydi, sotuvchi bilan chat yoki qo'ng'iroq orqali bog'lanadi.")
    p.kv("Sotuvchi (Seller)", "do'kon ochadi, mahsulot joylaydi va tahrirlaydi, statistikani ko'radi, e'lonni ko'taradi.")
    p.kv("Admin / Moderator", "e'lon va do'konlarni moderatsiya qiladi, shikoyatlar bilan ishlaydi, foydalanuvchini bloklaydi, analitikani kuzatadi.")

    p.h1("4. Asosiy modullar (funksiyalar ro'yxati)")
    p.h2("Xaridor uchun")
    for b in [
        "Telefon raqami (SMS-kod / OTP) orqali ro'yxatdan o'tish va kirish",
        "Bosh sahifa: tavsiyalar, mashhur do'konlar, kategoriyalar",
        "Aqlli qidiruv va filtrlar (narx, hudud, kategoriya, masofa)",
        "Xaritada do'konlarni ko'rish (geolokatsiya)",
        "Mahsulot sahifasi: rasmlar, narx, tavsif, do'kon ma'lumoti",
        "Sevimlilar va so'nggi ko'rilganlar ro'yxati",
        "Sotuvchiga chat, telefon yoki Telegram orqali bog'lanish",
        "Do'konga sharh va reyting qoldirish",
    ]:
        p.bullet(b)
    p.h2("Sotuvchi uchun")
    for b in [
        "Do'kon profili: logo, banner, manzil, ish vaqti, kontaktlar",
        "Mahsulot qo'shish/tahrirlash: rasm, narx, miqdor, kategoriya, status",
        "Statistika: ko'rishlar soni, bog'lanishlar soni",
        "E'lonni ko'tarish (boost / premium joylashuv)",
        "Kelgan xabarlar (chat) boshqaruvi",
    ]:
        p.bullet(b)
    p.h2("Admin panel uchun")
    for b in [
        "E'lon va do'konlarni moderatsiya qilish (tasdiqlash / rad etish)",
        "Shikoyatlar bilan ishlash, spam va firibgarlikka qarshi kurash",
        "Foydalanuvchi yoki do'konni bloklash",
        "Kategoriyalarni boshqarish va umumiy analitika",
    ]:
        p.bullet(b)

    p.h1("5. Texnologiyalar steki (taklif)")
    p.h2("A yo'li - Tez va arzon boshlash (MVP uchun tavsiya etiladi)")
    p.table(
        ["Qatlam", "Texnologiya"],
        [["Mobil ilova", "Flutter (Android + iOS bitta kod bazasi)"],
         ["Backend + DB + Auth", "Supabase (PostgreSQL + Auth + Storage)"],
         ["Qidiruv", "PostgreSQL full-text, keyinchalik Meilisearch"],
         ["Rasmlar", "Supabase Storage yoki Cloudinary"],
         ["Xarita", "Google Maps yoki 2GIS (O'zbekistonda kuchli)"],
         ["Chat", "Supabase Realtime yoki GetStream"],
         ["Push bildirishnoma", "Firebase Cloud Messaging"]],
        [0.34, 0.66])
    p.h2("B yo'li - To'liq nazorat (kelajakda kengayish uchun)")
    p.bullet("Mobil: Flutter yoki React Native")
    p.bullet("Backend: Node.js (NestJS) yoki Go")
    p.bullet("Ma'lumotlar bazasi: PostgreSQL; qidiruv: Meilisearch yoki Elasticsearch")
    p.bullet("Arxitektura: avval monolit, millionlab e'lon bo'lganda mikroservislarga o'tish")
    p.para("Geolokatsiyali qidiruvda Meilisearch _geoPoint imkoniyati eng yaqin do'konlarni "
           "masofa bo'yicha saralash imkonini beradi.", size=9.5, color=GRAY)

    p.h1("6. Ma'lumotlar bazasi sxemasi (asosiy jadvallar)")
    p.code([
        "users          (id, phone, name, role, status, created_at)",
        "shops          (id, owner_id -> users, name, logo, banner,",
        "                address, lat, lng, region, working_hours,",
        "                contact, rating)",
        "categories     (id, parent_id, name, icon, slug)",
        "products       (id, shop_id -> shops, category_id, title,",
        "                description, price, currency,",
        "                status[active/paused/sold], created_at)",
        "product_images (id, product_id, url, position)",
        "favorites      (id, user_id, product_id)",
        "reviews        (id, shop_id, user_id, rating, comment, created_at)",
        "chats          (id, buyer_id, seller_id, product_id)",
        "messages       (id, chat_id, sender_id, text, is_read, created_at)",
        "reports        (id, reporter_id, target_type, target_id,",
        "                reason, status)",
        "boosts         (id, product_id, type, start_at, end_at)",
    ])

    p.h1("7. Xavfsizlik va moderatsiya")
    p.kv("Autentifikatsiya", "SMS-kod (OTP) va JWT token, ishonchli sessiya boshqaruvi.")
    p.kv("RBAC", "har bir rol faqat o'ziga ruxsat etilgan amallarni bajaradi.")
    p.kv("Ma'lumot himoyasi", "HTTPS, parol va tokenlarni shifrlash, rate limiting (spam va DDoS-ga qarshi).")
    p.kv("Moderatsiya", "e'lonlarni avtomatik tekshirish va admin tasdig'i, taqiqlangan so'zlar filtri.")
    p.kv("Firibgarlikka qarshi", "shubhali xatti-harakatni kuzatish, tasdiqlangan do'kon nishonlari, shikoyat tizimi.")
    p.kv("Ishonch", "vaqt belgili sharhlar, reyting va 'tasdiqlangan sotuvchi' belgisi.")

    p.h1("8. Dizayn (UI/UX) manbalari")
    p.bullet("Figma - Free Mobile UI Kit (chat va ijtimoiy komponentlar)")
    p.bullet("eCommerce Free App UI Kit (Figma)")
    p.bullet("Tech Marketplace UI Kit (bosh sahifa, qidiruv, akkaunt, kategoriyalar)")
    p.bullet("Netguru - Free Design System for Marketplaces")
    p.bullet("uithings.com - 10 Best Free Figma UI Kits 2026 to'plami")

    p.h1("9. Tayyor ochiq kodli shablonlar")
    p.kv("OpenClassify", "Laravel asosidagi zamonaviy classifieds platforma, AI bilan (rasmdan kategoriya/sarlavha avtomatik).")
    p.kv("Osclass", "yengil PHP classifieds, 40+ til, Apache 2.0 litsenziya (tijorat uchun bepul).")
    p.kv("React-Firebase namuna", "React va Firebase asosidagi classifieds namuna - chat va xarita bilan; o'rganish uchun.")
    p.kv("Sharetribe", "to'liq marketplace yechimi va developer hujjatlari.")

    p.h1("10. Monetizatsiya (daromad modeli)")
    p.para("To'lov ilova ichida bo'lmagani uchun daromad quyidagi yo'llardan olinadi:")
    p.bullet("Premium / featured e'lonlar (ko'tarish - boost)")
    p.bullet("Do'konlar uchun oylik yoki yillik obuna (tariflar)")
    p.bullet("Banner va targetlangan reklama")
    p.bullet("Tasdiqlangan (verified) do'kon maqomi uchun to'lov")

    p.h1("11. Bosqichma-bosqich yo'l xaritasi")
    p.table(
        ["Bosqich", "Tarkib"],
        [["MVP (1-2 oy)", "Auth, do'kon profili, mahsulot joylash, qidiruv, chat"],
         ["v2", "Xarita/geolokatsiya, filtrlar, sharh va reyting, push"],
         ["v3", "Admin moderatsiya paneli, boost/monetizatsiya, analitika"],
         ["v4", "Mikroservis, AI qidiruv va tavsiyalar, masshtablash"]],
        [0.24, 0.76])

    p.h1("12. Manbalar (havolalar)")
    for s in [
        "developers.dev - classifieds marketplace blueprint & cost",
        "ulansoftware.com - Marketplace software architecture trends",
        "sharetribe.com - Build a marketplace app (developer's guide)",
        "datavidhya.com - Online marketplace two-sided data model",
        "meilisearch.com - Geo search and marketplace search engine",
        "getstream.io / cometchat.com - Marketplace content moderation",
        "rst.software - Marketplace fraud detection best practices",
        "github.com/openclassify/openclassify - open source classifieds",
        "osclass-classifieds.com - self-hosted classifieds CMS",
        "figma.com community - marketplace & mobile UI kits",
    ]:
        p.bullet(s, size=9.5)
    p.spacer(6)
    p.para("Eslatma: ushbu hujjatdagi tashqi manbalardan olingan ma'lumotlar litsenziyaga "
           "rioya qilish uchun qayta ifodalangan (rephrased).", size=8.5, color=GRAY)

    size = p.build("/projects/sandbox/RASTA/Uzbekiston_Onlayn_Bozor_Loyiha_Rejasi.pdf")
    print("PDF yaratildi, hajmi:", size, "bayt, sahifalar:", p.page_no)

if __name__ == "__main__":
    main()
