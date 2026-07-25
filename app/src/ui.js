import { esc } from './http.js';

/* ---------- ikonkalar ---------- */
const ICONS = {
  home: '<path d="M3 11l9-8 9 8"/><path d="M5 10v10h14V10M9 20v-6h6v6"/>',
  search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/>',
  compass: '<circle cx="12" cy="12" r="9"/><path d="m15.5 8.5-2 5-5 2 2-5 5-2Z"/>',
  heart: '<path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.8-7.5a5.5 5.5 0 0 0 1-8.9Z"/>',
  chat: '<path d="M21 11.5a8.4 8.4 0 0 1-9 8.3 9 9 0 0 1-3.5-.6L3 21l1.8-4.5A8.3 8.3 0 0 1 3.7 8 8.4 8.4 0 0 1 12 3.2 8.4 8.4 0 0 1 21 11.5Z"/>',
  send: '<path d="M22 2 11 13"/><path d="M22 2 15 22l-4-9-9-4 20-7Z"/>',
  bookmark: '<path d="M6 3h12a1 1 0 0 1 1 1v17l-7-5-7 5V4a1 1 0 0 1 1-1Z"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  bell: '<path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9"/><path d="M10 21h4"/>',
  grid: '<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>',
  box: '<path d="m21 8-9 5-9-5 9-5 9 5Z"/><path d="m3 8 9 5v9l9-5V8M12 13v9"/>',
  layers: '<path d="m12 2 9 5-9 5-9-5 9-5Z"/><path d="m3 12 9 5 9-5M3 17l9 5 9-5"/>',
  shop: '<path d="M4 9h16l-1.5-5H5.5L4 9Z"/><path d="M5 9v11h14V9M9 20v-6h6v6"/>',
  users: '<path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M8.5 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM17 11l2 2 4-4"/>',
  shield: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"/><path d="m9 12 2 2 4-4"/>',
  sliders: '<path d="M4 21v-7M4 10V3M12 21v-9M12 8V3M20 21v-5M20 12V3M1 14h6M9 8h6M17 16h6"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  alert: '<path d="M10.3 3.7 2.2 18a2 2 0 0 0 1.8 3h16a2 2 0 0 0 1.8-3L13.7 3.7a2 2 0 0 0-3.4 0Z"/><path d="M12 9v4M12 17h.01"/>',
  info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/>',
  eye: '<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/>',
  pin: '<path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/>',
  tag: '<path d="M20.6 13.4 12 22l-9-9V4a1 1 0 0 1 1-1h9l7.6 7.6a2 2 0 0 1 0 2.8Z"/><circle cx="8" cy="8" r="1.5"/>',
  star: '<path d="m12 3 2.6 5.6 6 .7-4.5 4 1.3 6-5.4-3.1L6.6 19l1.3-6-4.5-4 6-.7L12 3Z"/>',
  gift: '<rect x="3" y="8" width="18" height="4" rx="1"/><path d="M5 12v9h14v-9M12 8v13"/>',
  upload: '<path d="M12 15V4M8 8l4-4 4 4"/><path d="M20 15v5H4v-5"/>',
  back: '<path d="m15 18-6-6 6-6"/>',
  next: '<path d="m9 18 6-6-6-6"/>',
  x: '<path d="M18 6 6 18M6 6l12 12"/>',
  check: '<path d="M20 6 9 17l-5-5"/>',
  logout: '<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><path d="m16 17 5-5-5-5M21 12H9"/>',
  phone: '<path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 2 .7 2.9a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.2-1.2a2 2 0 0 1 2.1-.5c1 .3 1.9.6 2.9.7a2 2 0 0 1 1.7 2Z"/>',
};

export const icon = (name, cls = '') =>
  `<svg ${cls ? `class="${cls}" ` : ''}viewBox="0 0 24 24" aria-hidden="true">${ICONS[name] || ICONS.box}</svg>`;

/* ---------- mahsulot illyustratsiyalari (rasm yuklanmagan holat uchun) ---------- */
const ART = {
  phone: (c) => `<rect x="42" y="14" width="56" height="112" rx="13" fill="${c}"/><rect x="47" y="21" width="46" height="94" rx="9" fill="#e2f6f2"/><circle cx="54" cy="31" r="5" fill="#1e2a2f"/><path d="M55 50c20-16 32 5 38 26-17 1-33-6-38-26Z" fill="#3fa093" opacity=".85"/>`,
  buds: (c) => `<path d="M50 40c-12 0-19 9-19 20s6 19 15 19c9 0 15-6 15-15V51c0-7-4-11-11-11Z" fill="${c}"/><rect x="51" y="70" width="9" height="40" rx="4" fill="${c}"/><path d="M90 40c12 0 19 9 19 20s-6 19-15 19c-9 0-15-6-15-15V51c0-7 4-11 11-11Z" fill="${c}"/><rect x="80" y="70" width="9" height="40" rx="4" fill="${c}"/>`,
  house: (c) => `<path d="M68 26 26 60v50h84V60L68 26Z" fill="${c}"/><path d="M20 62 68 24l48 38" fill="none" stroke="#2b3535" stroke-width="6" stroke-linecap="round"/><rect x="58" y="80" width="20" height="30" rx="2" fill="#e2f6f2"/><rect x="38" y="70" width="15" height="14" rx="2" fill="#e2f6f2"/><rect x="83" y="70" width="15" height="14" rx="2" fill="#e2f6f2"/>`,
  car: (c) => `<path d="M26 80l8-25a11 11 0 0 1 10-8h44a11 11 0 0 1 10 8l8 25v20a4 4 0 0 1-4 4h-8a4 4 0 0 1-4-4v-3H42v3a4 4 0 0 1-4 4h-8a4 4 0 0 1-4-4V80Z" fill="${c}"/><path d="M42 55h52l6 21H36l6-21Z" fill="#dff0ee" opacity=".9"/><circle cx="46" cy="92" r="6" fill="#1c2831"/><circle cx="90" cy="92" r="6" fill="#1c2831"/>`,
  wrench: (c) => `<path d="M94 28a17 17 0 0 0-21 21L37 85a10 10 0 1 0 14 14l36-36a17 17 0 0 0 21-21l-13 13-11-2-2-11 12-14Z" fill="${c}"/>`,
  pill: (c) => `<rect x="48" y="20" width="40" height="14" rx="3" fill="#2b3535"/><rect x="44" y="34" width="48" height="80" rx="11" fill="${c}"/><rect x="63" y="52" width="10" height="30" rx="3" fill="#fff"/><rect x="53" y="62" width="30" height="10" rx="3" fill="#fff"/>`,
  chair: (c) => `<path d="M42 60c0-19 10-31 26-31s26 12 26 31v30H42V60Z" fill="${c}"/><rect x="31" y="67" width="74" height="34" rx="13" fill="${c}"/><path d="M44 101l-7 20M92 101l7 20" stroke="#77563b" stroke-width="6"/>`,
  drill: (c) => `<path d="M30 42h66a11 11 0 0 1 11 11v17H62l-10-10H30V42Z" fill="${c}"/><path d="M64 68h28l-9 42H60l-6-36 10-6Z" fill="#2b3535"/><rect x="82" y="102" width="21" height="13" rx="3" fill="${c}"/>`,
  tshirt: (c) => `<path d="M50 24 34 34l-12 16 14 10 6-6v46h52V54l6 6 14-10-12-16-16-10c-4 6-32 6-36 0Z" fill="${c}"/>`,
  food: (c) => `<circle cx="68" cy="70" r="40" fill="${c}"/><path d="M40 66h56a28 28 0 0 1-56 0Z" fill="#fff" opacity=".85"/><rect x="64" y="20" width="8" height="26" rx="4" fill="#8a5a2b"/>`,
  torch: (c) => `<rect x="50" y="58" width="36" height="62" rx="7" fill="${c}"/><path d="M50 58 42 34h52l-8 24Z" fill="${c}"/><rect x="48" y="30" width="40" height="9" rx="4" fill="#f4d06a"/><path d="M68 6v12M50 12l6 9M86 12l-6 9" stroke="#f4d06a" stroke-width="5" stroke-linecap="round"/>`,
  bag: (c) => `<path d="M44 46c0-12 6-20 24-20s24 8 24 20" fill="none" stroke="${c}" stroke-width="8"/><path d="M34 44h68l6 66H28l6-66Z" fill="${c}"/>`,
  watch: (c) => `<rect x="52" y="12" width="32" height="22" rx="6" fill="${c}"/><rect x="52" y="102" width="32" height="22" rx="6" fill="${c}"/><rect x="40" y="34" width="56" height="68" rx="16" fill="${c}"/><rect x="49" y="43" width="38" height="50" rx="10" fill="#dff4f0"/>`,
  shoe: (c) => `<path d="M22 84c19 1 34-9 40-38 11 16 20 22 40 27 9 2 16 8 15 17-1 9-11 12-27 12H30c-14 0-20-7-8-18Z" fill="${c}"/>`,
  honey: (c) => `<path d="M46 42h44v9l-6 6v47a10 10 0 0 1-10 10H62a10 10 0 0 1-10-10V57l-6-6v-9Z" fill="${c}"/><rect x="42" y="30" width="52" height="13" rx="3" fill="#e7bc72"/>`,
  all: () => `<rect x="26" y="26" width="37" height="37" rx="9" fill="#0c9b88"/><rect x="73" y="26" width="37" height="37" rx="9" fill="#f5633c"/><rect x="26" y="73" width="37" height="37" rx="9" fill="#3f74d6"/><rect x="73" y="73" width="37" height="37" rx="9" fill="#d09220"/>`,
};

export const ART_KINDS = Object.keys(ART);

export function art(kind, color = '#26384a', bg = '') {
  const draw = ART[kind] || ART.phone;
  return `<svg class="art" viewBox="0 0 136 136" preserveAspectRatio="xMidYMid meet"${
    bg ? ` style="background:${esc(bg)}"` : ''
  }>${draw(esc(color))}</svg>`;
}

/* ---------- kichik komponentlar ---------- */
export const avatar = (title, color = '#0c9b88', cls = 'avatar') =>
  `<span class="${cls}" style="background:${esc(color)}">${esc((title || '?')[0].toUpperCase())}</span>`;

export const verified = (on) =>
  on ? `<svg class="verified" viewBox="0 0 24 24">${ICONS.shield}</svg>` : '';

export function stars(rating) {
  let out = '';
  for (let i = 1; i <= 5; i++) {
    out += `<svg viewBox="0 0 24 24"${i <= rating ? '' : ' class="off"'}>${ICONS.star}</svg>`;
  }
  return `<span class="stars">${out}</span>`;
}

export function money(price, note) {
  if (price === null || price === undefined) return note ? esc(note) : 'Kelishiladi';
  // Minglikni oddiy bo'shliq bilan ajratamiz (ajratilmaydigan bo'shliq qidiruv va nusxalashni buzadi)
  const formatted = String(Math.round(Number(price))).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  return `${formatted} so‘m${note ? ` / ${esc(note)}` : ''}`;
}

/** E'lonning asosiy rasmi yoki illyustratsiya. */
export function listingMedia(listing, images = []) {
  if (images.length) return `<img src="/uploads/${esc(images[0].path)}" alt="${esc(listing.title)}">`;
  return art(listing.art_kind, listing.art_color, listing.art_bg);
}

export const timeAgo = (iso) => {
  const diff = (Date.now() - new Date(iso.replace(' ', 'T') + 'Z').getTime()) / 1000;
  if (diff < 60) return 'hozir';
  if (diff < 3600) return `${Math.floor(diff / 60)} daqiqa oldin`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} soat oldin`;
  if (diff < 172800) return 'kecha';
  return `${Math.floor(diff / 86400)} kun oldin`;
};

export const STATUS_LABEL = {
  draft: 'Qoralama',
  pending: 'Tekshiruvda',
  active: 'Faol',
  rejected: 'Rad etilgan',
  hidden: 'Yashirilgan',
};

export const TYPE_LABEL = {
  product: 'Mahsulot',
  property: 'Ko‘chmas mulk',
  car: 'Avtomobil',
  service: 'Xizmat',
};

/* ---------- sahifa shabloni ---------- */
function bottomNav(active, user) {
  const items = [
    ['/', 'home', 'feed'],
    ['/explore', 'compass', 'explore'],
    ['/saved', 'bookmark', 'saved'],
    ['/messages', 'chat', 'messages'],
  ];
  const links = items
    .map(
      ([href, ic, key]) =>
        `<a href="${href}" class="${active === key ? 'on' : ''}" aria-label="${key}">${icon(ic)}</a>`
    )
    .join('');
  const profile = user
    ? `<a href="/me" class="${active === 'me' ? 'on' : ''}">${avatar(user.name, '#0c9b88')}</a>`
    : `<a href="/login" class="${active === 'me' ? 'on' : ''}">${icon('users')}</a>`;
  return `<nav class="bottomnav">${links}${profile}</nav>`;
}

/**
 * Umumiy sahifa qobig'i.
 * shell: 'buyer' | 'seller' | 'admin'
 */
export function layout({
  title,
  body,
  user = null,
  active = '',
  shell = 'buyer',
  subnav = '',
  unread = 0,
  flash = null,
  wide = false,
}) {
  const topClass = shell === 'admin' ? 'topbar admin-top super' : shell === 'seller' ? 'topbar admin-top' : 'topbar';
  const right =
    shell === 'buyer'
      ? `<a class="icon-btn" href="/messages" aria-label="Xabarlar">${icon('chat')}${
          unread ? `<span class="badge-dot">${unread}</span>` : ''
        }</a>${
          user
            ? `<a class="icon-btn" href="/me" aria-label="Profil">${avatar(user.name)}</a>`
            : `<a class="btn btn-grad sm" href="/login">Kirish</a>`
        }`
      : `<span class="role-tag${shell === 'admin' ? ' super' : ''}">${
          shell === 'admin' ? 'SUPER ADMIN' : 'DO‘KON'
        }</span><a class="icon-btn" href="/" aria-label="Ilovaga qaytish">${icon('eye')}</a>`;

  const flashHtml = flash
    ? `<div class="alert-msg ${flash.type === 'err' ? 'err' : 'ok'}">${esc(flash.text)}</div>`
    : '';

  return `<!doctype html>
<html lang="uz">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="theme-color" content="#ffffff">
<title>${esc(title)} · RASTA</title>
<link rel="stylesheet" href="/styles.css">
</head>
<body>
<header class="${topClass}">
  <a href="${shell === 'admin' ? '/admin' : shell === 'seller' ? '/seller' : '/'}" class="logo">RASTA</a>
  <span class="sp"></span>
  ${right}
</header>
${subnav}
<main class="wrap${wide ? ' wide' : ''}">${flashHtml}${body}</main>
${shell === 'buyer' ? bottomNav(active, user) : ''}
<div class="toast" id="toast"></div>
<script src="/app.js" defer></script>
</body>
</html>`;
}
