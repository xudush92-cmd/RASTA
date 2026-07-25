#!/usr/bin/env bash
# RASTA'ni Ubuntu serverga o'rnatish (masalan Oracle Cloud Always Free VM).
# Ishga tushirish:  sudo bash setup-server.sh
set -euo pipefail

REPO_URL="${REPO_URL:-https://github.com/xudush92-cmd/RASTA.git}"
BRANCH="${BRANCH:-main}"
APP_DIR=/opt/rasta
DATA_DIR=/var/lib/rasta

echo "==> 1/6  Tizim yangilanmoqda"
apt-get update -qq
apt-get install -y -qq curl git nginx

echo "==> 2/6  Node.js 22 o'rnatilmoqda"
if ! command -v node >/dev/null || [ "$(node -v | cut -d. -f1 | tr -d v)" -lt 22 ]; then
  curl -fsSL https://deb.nodesource.com/setup_22.x | bash -
  apt-get install -y -qq nodejs
fi
node -v

echo "==> 3/6  Kod yuklanmoqda"
id -u rasta >/dev/null 2>&1 || useradd --system --create-home --shell /usr/sbin/nologin rasta
if [ -d "$APP_DIR/.git" ]; then
  git -C "$APP_DIR" fetch --all -q && git -C "$APP_DIR" reset --hard "origin/$BRANCH" -q
else
  git clone -q --branch "$BRANCH" "$REPO_URL" "$APP_DIR"
fi
mkdir -p "$DATA_DIR/uploads"
chown -R rasta:rasta "$APP_DIR" "$DATA_DIR"

echo "==> 4/6  Xizmat sozlanmoqda"
cp "$APP_DIR/deploy/rasta.service" /etc/systemd/system/rasta.service
systemctl daemon-reload
systemctl enable --now rasta
sleep 2
systemctl is-active --quiet rasta && echo "    xizmat ishlayapti" || { journalctl -u rasta -n 20 --no-pager; exit 1; }

echo "==> 5/6  Nginx sozlanmoqda"
cp "$APP_DIR/deploy/nginx.conf" /etc/nginx/sites-available/rasta
ln -sf /etc/nginx/sites-available/rasta /etc/nginx/sites-enabled/rasta
rm -f /etc/nginx/sites-enabled/default
nginx -t && systemctl reload nginx

echo "==> 6/6  Tayyor"
cat <<'INFO'

RASTA ishga tushdi. Endi:

  1. Domenni serverga yo'naltiring (DNS A yozuvi → server IP manzili)
  2. Nginx faylida server_name ni o'z domeningizga o'zgartiring:
       sudo nano /etc/nginx/sites-available/rasta
  3. Bepul HTTPS sertifikat oling:
       sudo apt install -y certbot python3-certbot-nginx
       sudo certbot --nginx -d rasta.uz -d www.rasta.uz

Foydali buyruqlar:
  sudo systemctl status rasta      # holat
  sudo journalctl -u rasta -f      # loglar
  sudo systemctl restart rasta     # qayta ishga tushirish

Bazani zaxiralash (kuniga bir marta cron'ga qo'ying):
  sqlite3 /var/lib/rasta/rasta.db ".backup /var/backups/rasta-$(date +%F).db"

INFO
