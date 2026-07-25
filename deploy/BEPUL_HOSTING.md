# RASTA'ni bepul ishga tushirish

Uch yo'l bor. Tavsiya: **1-yo'l** bilan sinab ko'ring, keyin **3-yo'l** bilan doimiy sayt qiling.

---

## 1-yo'l: GitHub Codespaces — hech narsa o'rnatmasdan (eng tez)

Brauzerda ishlaydi, hatto telefondan ham. Hisobingizda har oy bepul soatlar beriladi
(shaxsiy hisobda odatda ~60 core-soat; talabalar uchun ko'proq).

1. GitHub'da repoga kirasiz → yashil **Code** tugmasi → **Codespaces** → **Create codespace**
2. Ochilgan terminalda:

```bash
cd app
npm start
```

3. Pastda **"Open in Browser"** oynasi chiqadi — bosasiz, ilova ochiladi.
4. Havolani boshqalarga ko'rsatish uchun: **Ports** paneli → 3000 portga o'ng tugma →
   **Port Visibility** → **Public**. Endi havolani telefonga yuborib sinab ko'rasiz.

Namuna ma'lumotlar avtomatik yuklanadi (`.devcontainer` sozlangan). Qo'lda kerak bo'lsa: `npm run seed`.

> Codespace 30 daqiqa ishlatilmasa to'xtaydi (soatlar tejaladi), keyin qayta ishga tushiriladi.
> Ma'lumotlar codespace ichida saqlanib qoladi.

---

## 2-yo'l: Render.com — bepul ommaviy havola

Doimiy manzil beradi (`rasta-xxxx.onrender.com`), bank kartasi talab qilinmaydi.

1. [render.com](https://render.com) da GitHub bilan ro'yxatdan o'tasiz
2. **New → Blueprint** → reponi tanlaysiz. Render `render.yaml` faylini o'zi topadi
3. **Apply** bosasiz — 1-2 daqiqada ilova ishga tushadi

**Bepul rejaning cheklovlari (bilib qo'ying):**
- 15 daqiqa harakatsizlikdan keyin xizmat uxlaydi; keyingi kirishda ~1 daqiqa kutiladi
- Har oyda 750 soat limit
- **Doimiy disk yo'q** — xizmat qayta ishga tushganda baza tozalanadi va namuna
  ma'lumotlar qaytadan yuklanadi. Ya'ni bu **demo/sinov** uchun mos, haqiqiy
  foydalanuvchi ma'lumotlarini saqlash uchun emas.

Doimiy saqlash kerak bo'lsa: pullik rejaga o'tib, `render.yaml` dagi `disk` blokini yoqasiz.

---

## 3-yo'l: Oracle Cloud "Always Free" server — doimiy va bepul sayt

Bu haqiqiy server: o'z domeningiz (`rasta.uz`), HTTPS va **ma'lumotlar saqlanadi**.
Oracle'ning Always Free rejasi muddatsiz bepul (ro'yxatdan o'tishda karta tekshiriladi,
lekin Always Free resurslari uchun to'lov olinmaydi). 2026-yil o'zgarishiga ko'ra
bepul ARM quvvati 2 OCPU / 12 GB — RASTA uchun bundan ancha kam ham yetadi.

**Qadamlar:**

1. [oracle.com/cloud/free](https://www.oracle.com/cloud/free/) da ro'yxatdan o'tasiz
2. **Compute → Instances → Create Instance**:
   - Image: **Ubuntu 22.04** yoki 24.04
   - Shape: **VM.Standard.A1.Flex** (Always Free), 1 OCPU / 6 GB yetarli
   - SSH kalitini saqlab olasiz
3. **Networking → Security List** da 80 va 443 portlarni ochasiz
4. Serverga ulanasiz va bitta buyruq bajarasiz:

```bash
ssh ubuntu@SERVER_IP
sudo apt update && sudo apt install -y git
git clone https://github.com/xudush92-cmd/RASTA.git
sudo bash RASTA/deploy/setup-server.sh
```

Skript o'zi bajaradi: Node.js 22 o'rnatish, kodni yuklash, `systemd` xizmatini yaratish
(server o'chib-yonganda o'zi ishga tushadi), nginx sozlash.

5. Domenni ulash: domen provayderida **A yozuvi** → server IP manzili
6. Bepul HTTPS:

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d rasta.uz -d www.rasta.uz
```

**Foydali buyruqlar:**

```bash
sudo systemctl status rasta     # holat
sudo journalctl -u rasta -f     # loglar
sudo systemctl restart rasta    # qayta ishga tushirish
```

**Zaxira nusxa** (kuniga bir marta, cron orqali):

```bash
sudo apt install -y sqlite3
sqlite3 /var/lib/rasta/rasta.db ".backup /var/backups/rasta-$(date +%F).db"
```

---

## Docker bilan (istalgan hostingda)

```bash
cd app
docker build -t rasta .
docker run -d -p 3000:3000 -v rasta-data:/data --name rasta rasta
```

Ma'lumotlar `rasta-data` volume'ida saqlanadi.

---

## Ishlab chiqarishga chiqarishdan oldin

Ilova ishlaydi, lekin haqiqiy foydalanuvchilarga ochishdan oldin quyidagilar kerak:

- CSRF token va rate limiting (spam va hujumga qarshi)
- HTTPS majburiy (certbot bilan hal bo'ladi)
- Admin panel uchun 2FA va alohida domen/IP cheklovi
- Ko'p foydalanuvchi bo'lganda SQLite → **PostgreSQL**
- Rasm qayta ishlash (hajmini kichraytirish, EXIF tozalash)
- Muntazam zaxira nusxa
