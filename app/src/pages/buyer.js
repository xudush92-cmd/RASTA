import { esc } from '../http.js';
import {
  icon, art, avatar, verified, stars, money, layout, listingMedia, timeAgo, TYPE_LABEL,
} from '../ui.js';
import * as q from '../queries.js';

/* ---------- kategoriya paneli (rasmli) ---------- */
function categoryRow(activeCat, extra = '') {
  const cards = [{ name: 'Barchasi', art_kind: 'all', art_bg: '#eef2f1', art_color: '#0c9b88' }, ...q.categories()];
  const html = cards
    .map((c) => {
      const on = (activeCat || 'Barchasi') === c.name;
      const href = c.name === 'Barchasi' ? `/${extra}` : `/?cat=${encodeURIComponent(c.name)}`;
      return `<a class="cat-card ${on ? 'on' : ''}" href="${href}">
        <span class="cat-img" style="background:${esc(c.art_bg)}">${art(c.art_kind, c.art_color, '')}</span>
        <small>${esc(c.name)}</small></a>`;
    })
    .join('');
  return `<div class="cat-row">${html}</div>`;
}

function subRow(catName, activeSub) {
  const cat = q.categoryByName(catName);
  if (!cat) return '';
  const subs = q.subcategories(cat.id);
  if (!subs.length) return '';
  const chip = (label, value) => {
    const on = (activeSub || '') === value;
    const url = `/?cat=${encodeURIComponent(catName)}${value ? `&sub=${encodeURIComponent(value)}` : ''}`;
    return `<a class="pill ${on ? 'on' : ''}" href="${url}">${esc(label)}</a>`;
  };
  return `<div class="chips">${chip('Hammasi', '')}${subs.map((s) => chip(s, s)).join('')}</div>`;
}

/* ---------- e'lon kartasi ---------- */
export function postCard(listing, { saved = false, liked = false } = {}) {
  const isStore = !!listing.store_id;
  const who = isStore ? listing.store_title : listing.owner_name;
  const link = isStore ? `/store/${esc(listing.store_slug)}` : '#';
  const cover = listing.cover
    ? `<img src="/uploads/${esc(listing.cover)}" alt="${esc(listing.title)}">`
    : art(listing.art_kind, listing.art_color, listing.art_bg);
  const condBadge = listing.deal || listing.condition;

  return `<article class="post">
    <div class="post-head">
      <a href="${link}">${avatar(who, isStore ? listing.store_color : '#7a8690')}</a>
      <div><b><a href="${link}">${esc(who)}</a> ${verified(isStore && listing.store_verified)}</b>
        <div class="sub">${esc(listing.area || '—')}</div></div>
    </div>
    <a class="post-media" href="/listing/${listing.id}" style="background:${esc(listing.art_bg)}">
      ${cover}
      <div class="badges">
        <span class="badge ${isStore ? 'store' : 'personal'}">${isStore ? 'Do‘kon' : 'Shaxsiy'}</span>
        ${condBadge ? `<span class="badge ${condBadge === 'Yangi' ? 'new' : 'used'}">${esc(condBadge)}</span>` : ''}
      </div>
      <span class="media-price">${money(listing.price, listing.price_note)}</span>
    </a>
    <div class="post-actions">
      <button class="act like ${liked ? 'on' : ''}" data-action="/api/like/${listing.id}" aria-label="Yoqtirish">
        ${icon('heart')}</button>
      <button class="act save ${saved ? 'on' : ''}" data-action="/api/save/${listing.id}" aria-label="Saqlash">
        ${icon('bookmark')}</button>
      <a class="contact" href="/listing/${listing.id}#contact">${icon('chat')} Bog‘lanish</a>
    </div>
    <div class="post-body">
      <a class="title" href="/listing/${listing.id}">${esc(listing.title)}</a>
      <div class="meta">${esc(listing.category_name || TYPE_LABEL[listing.type])}${
        listing.stock ? ` · ${esc(listing.stock)}` : ''
      }</div>
      <div class="time">${esc(timeAgo(listing.created_at))}</div>
    </div>
  </article>`;
}

export function tile(listing) {
  const cover = listing.cover
    ? `<img src="/uploads/${esc(listing.cover)}" alt="${esc(listing.title)}">`
    : art(listing.art_kind, listing.art_color, listing.art_bg);
  return `<a class="tile" href="/listing/${listing.id}" style="background:${esc(listing.art_bg)}">
    ${cover}<span class="tprice">${money(listing.price, listing.price_note)}</span></a>`;
}

/* ---------- feed ---------- */
export function feedPage({ user, cat, sub, listings, unread }) {
  const body = `${categoryRow(cat)}${cat ? subRow(cat, sub) : ''}
    ${
      listings.length
        ? listings
            .map((l) => postCard(l, { saved: q.isSaved(user?.id, l.id), liked: q.isLiked(user?.id, l.id) }))
            .join('')
        : `<div class="empty"><h3>E‘lon topilmadi</h3><p>${
            cat ? `«${esc(cat)}» bo‘yicha hozircha e‘lon yo‘q.` : 'Hozircha e‘lonlar yo‘q.'
          }</p></div>`
    }`;
  return layout({ title: cat || 'Bosh sahifa', body, user, active: 'feed', unread });
}

/* ---------- explore / qidiruv ---------- */
export function explorePage({ user, qText, sort, listings, unread }) {
  const sortChip = (label, value) =>
    `<a class="pill ${sort === value ? 'on' : ''}" href="/explore?q=${encodeURIComponent(qText)}&sort=${value}">${label}</a>`;
  const body = `
    <form class="searchbar" method="get" action="/explore">
      ${icon('search')}
      <input name="q" value="${esc(qText)}" placeholder="Mahsulot, do‘kon, xizmat yoki kategoriya" autofocus>
    </form>
    <div class="chips">${sortChip('Eng yangi', 'new')}${sortChip('Arzon', 'cheap')}${sortChip('Qimmat', 'expensive')}</div>
    ${
      listings.length
        ? `<p class="muted" style="margin-bottom:10px">${listings.length} ta natija</p>
           <div class="grid">${listings.map(tile).join('')}</div>`
        : `<div class="empty"><h3>Natija topilmadi</h3><p>Boshqa nom yoki kalit so‘zni sinab ko‘ring.</p></div>`
    }`;
  return layout({ title: 'Qidiruv', body, user, active: 'explore', unread });
}

/* ---------- e'lon batafsil ---------- */
export function listingPage({ user, listing, images, attrs, similar, saved, liked, store, follow, reviews, unread, flash }) {
  const slides = images.length
    ? images.map((img, i) => `<div class="slide ${i === 0 ? 'on' : ''}"><img src="/uploads/${esc(img.path)}" alt="${esc(listing.title)}"></div>`).join('')
    : `<div class="slide on">${art(listing.art_kind, listing.art_color, listing.art_bg)}</div>`;
  const dots = images.length > 1
    ? `<div class="dots">${images.map((_, i) => `<i class="${i === 0 ? 'on' : ''}"></i>`).join('')}</div>
       <button class="gnav prev">${icon('back')}</button><button class="gnav next">${icon('next')}</button>`
    : '';

  const isStore = !!store;
  const who = isStore ? store.title : listing.owner_name;
  const attrRows = attrs.length
    ? `<div class="label">Xususiyatlar</div><div class="attrs">${attrs
        .map((a) => `<div class="attr"><span>${esc(a.key)}</span><b>${esc(a.value)}</b></div>`)
        .join('')}</div>`
    : '';

  const reviewsBlock = isStore
    ? `<div class="label">Sotuvchi baholari</div>
       ${
         reviews.length
           ? reviews
               .slice(0, 3)
               .map(
                 (r) => `<div class="rev">${avatar(r.user_name, '#e2eeec')}
                   <div style="flex:1"><div class="rev-h"><b>${esc(r.user_name)}</b>${stars(r.rating)}</div>
                   <p>${esc(r.text)}</p><div class="t">${esc(timeAgo(r.created_at))}</div></div></div>`
               )
               .join('')
           : '<p class="muted" style="font-size:12.5px">Hozircha sharh yo‘q.</p>'
       }`
    : '';

  const contactForm = user
    ? `<form method="post" action="/listing/${listing.id}/message" class="reply" id="contact">
         <input name="body" placeholder="Savolingizni yozing..." required maxlength="1000">
         <button class="btn btn-grad" type="submit">${icon('send')}</button>
       </form>`
    : `<a class="btn btn-grad full" href="/login?next=/listing/${listing.id}" id="contact">${icon('chat')} Bog‘lanish uchun kiring</a>`;

  const body = `
    <a class="btn btn-line sm" href="/" style="margin-bottom:12px">${icon('back')} Orqaga</a>
    <div class="detail">
      <div class="gallery" style="background:${esc(listing.art_bg)}">
        <div class="slides">${slides}</div>
        <div class="badges">
          <span class="badge ${isStore ? 'store' : 'personal'}">${isStore ? 'Do‘kon' : 'Shaxsiy'}</span>
          ${listing.deal ? `<span class="badge used">${esc(listing.deal)}</span>` : ''}
          ${listing.condition ? `<span class="badge ${listing.condition === 'Yangi' ? 'new' : 'used'}">${esc(listing.condition)}</span>` : ''}
        </div>
        ${dots}
      </div>
      <div class="d-body">
        <div class="post-head" style="padding:0 0 14px;border-bottom:1px solid var(--line);margin-bottom:14px">
          <a href="${isStore ? `/store/${esc(store.slug)}` : '#'}">${avatar(who, isStore ? store.color : '#7a8690')}</a>
          <div><b>${esc(who)} ${verified(isStore && store.verified)}</b>
            <div class="sub">${esc(listing.area || '—')} · ${esc(TYPE_LABEL[listing.type])}</div></div>
          ${
            isStore && user
              ? `<button class="btn btn-line sm ${follow ? 'on' : ''}" style="margin-left:auto"
                   data-action="/api/follow/${store.id}">${follow ? 'Kuzatilyapti' : 'Kuzatish'}</button>`
              : ''
          }
        </div>
        <h1 class="d-title">${esc(listing.title)}</h1>
        <div class="d-price">${money(listing.price, listing.price_note)}</div>
        ${listing.stock ? `<div class="d-avail"><i></i> ${esc(listing.stock)}</div>` : ''}
        ${listing.description ? `<div class="label">Sotuvchi tavsifi</div><p class="desc">${esc(listing.description)}</p>` : ''}
        ${attrRows}
        ${reviewsBlock}
        <div class="note">${icon('shield')}<span>Pul o‘tkazishdan oldin sotuvchi va mahsulotni tekshiring.
          RASTA ilova ichida to‘lovni qabul qilmaydi va kafolatlamaydi.</span></div>
      </div>
      <div class="d-actions">
        <button class="btn btn-line like ${liked ? 'on' : ''}" data-action="/api/like/${listing.id}">
          ${icon('heart')} <span class="count">${listing.likes}</span></button>
        <button class="btn btn-line save ${saved ? 'on' : ''}" data-action="/api/save/${listing.id}">
          ${icon('bookmark')}</button>
        <a class="btn btn-line" href="/report/${listing.id}">${icon('alert')}</a>
      </div>
      <div style="padding:0 18px 18px">${contactForm}</div>
    </div>
    ${
      similar.length
        ? `<div class="label" style="margin-top:22px">${icon('compass')} O‘xshash e‘lonlar</div>
           <div class="grid">${similar.map(tile).join('')}</div>`
        : ''
    }`;

  return layout({ title: listing.title, body, user, active: 'feed', unread, flash });
}

/* ---------- do'kon profili ---------- */
export function storePage({ user, store, stats, listings, reviews, follow, tab, unread }) {
  const tabLink = (label, value) =>
    `<a class="pill ${tab === value ? 'on' : ''}" href="/store/${esc(store.slug)}${value === 'reviews' ? '?tab=reviews' : ''}">${label}</a>`;

  const body = `
    <div class="pf-top">
      <span class="pf-ava" style="background:${esc(store.color)}">${esc(store.title[0])}</span>
      <div class="pf-meta">
        <h1>${esc(store.title)} ${verified(store.verified)}</h1>
        <div class="cat">${esc(store.category || '')}${store.area ? ` · ${esc(store.area)}` : ''}</div>
        <div class="pf-btns">
          ${
            user
              ? `<button class="btn btn-grad sm" data-action="/api/follow/${store.id}">${follow ? 'Kuzatilyapti' : 'Obuna bo‘lish'}</button>
                 <button class="btn btn-line sm ${follow?.notify ? 'on' : ''}" data-action="/api/notify/${store.id}"
                   title="Yangi e‘lon bildirishnomasi">${icon('bell')}</button>`
              : `<a class="btn btn-grad sm" href="/login?next=/store/${esc(store.slug)}">Obuna bo‘lish</a>`
          }
        </div>
      </div>
    </div>
    <div class="pf-stats">
      <div><b>${stats.listings}</b><span>e‘lon</span></div>
      <div><b>${stats.followers}</b><span>obunachi</span></div>
      <div><b>${stats.rating ?? '—'}</b><span>reyting</span></div>
    </div>
    ${store.bio ? `<p class="bio">${esc(store.bio)}</p>` : ''}
    <div class="chips">${tabLink('E‘lonlar', 'listings')}${tabLink(`Sharhlar (${stats.reviews})`, 'reviews')}</div>
    ${
      tab === 'reviews'
        ? reviews.length
          ? reviews
              .map(
                (r) => `<div class="rev">${avatar(r.user_name, '#e2eeec')}
                  <div style="flex:1"><div class="rev-h"><b>${esc(r.user_name)}</b>${stars(r.rating)}</div>
                  <p>${esc(r.text)}</p><div class="t">${esc(timeAgo(r.created_at))}</div></div></div>`
              )
              .join('')
          : `<div class="empty"><h3>Sharh yo‘q</h3><p>Bu do‘konga hali baho berilmagan.</p></div>`
        : listings.length
          ? `<div class="grid">${listings.map(tile).join('')}</div>`
          : `<div class="empty"><h3>E‘lon yo‘q</h3><p>Do‘konda hozircha faol e‘lon yo‘q.</p></div>`
    }`;

  return layout({ title: store.title, body, user, active: '', unread });
}

/* ---------- saqlangan ---------- */
export function savedPage({ user, listings, unread }) {
  const body = `
    <div class="page-head"><div><h1>Saqlangan</h1><p>Keyinroq ko‘rish uchun ajratganlaringiz</p></div></div>
    ${
      listings.length
        ? `<div class="grid">${listings.map(tile).join('')}</div>`
        : `<div class="empty"><h3>Hozircha bo‘sh</h3><p>E‘londagi belgini bosib saqlab qo‘ying.</p></div>`
    }`;
  return layout({ title: 'Saqlangan', body, user, active: 'saved', unread });
}

/* ---------- xabarlar ---------- */
export function threadsPage({ user, list, unread }) {
  const body = `
    <div class="page-head"><div><h1>Xabarlar</h1><p>Sotuvchi va xaridorlar bilan aloqa</p></div></div>
    ${
      list.length
        ? list
            .map(
              (t) => `<a class="thread-item" href="/messages/${t.peer_id}">
                ${avatar(t.peer_name, '#7a8690')}
                <div><b>${esc(t.peer_name)}</b><p>${esc(t.body.slice(0, 60))}</p></div>
                <span class="t">${esc(timeAgo(t.created_at))}${t.unread ? ` · ${t.unread} yangi` : ''}</span></a>`
            )
            .join('')
        : `<div class="empty"><h3>Xabar yo‘q</h3><p>E‘lon sahifasidan sotuvchiga yozing.</p></div>`
    }`;
  return layout({ title: 'Xabarlar', body, user, active: 'messages', unread });
}

export function conversationPage({ user, peer, messages, unread }) {
  const body = `
    <a class="btn btn-line sm" href="/messages" style="margin-bottom:12px">${icon('back')} Xabarlar</a>
    <div class="page-head"><div><h1>${esc(peer.name)}</h1><p>@${esc(peer.username)}</p></div></div>
    <div class="msg-list">
      ${messages
        .map(
          (m) => `<div class="msg ${m.from_user_id === user.id ? 'me' : 'them'}">
            ${esc(m.body)}</div>`
        )
        .join('')}
    </div>
    <form class="reply" method="post" action="/messages/${peer.id}">
      <input name="body" placeholder="Xabar yozing..." required maxlength="1000" autofocus>
      <button class="btn btn-grad" type="submit">${icon('send')}</button>
    </form>`;
  return layout({ title: peer.name, body, user, active: 'messages', unread });
}

/* ---------- profil ---------- */
export function mePage({ user, store, counts, unread }) {
  const body = `
    <div class="pf-top">
      ${avatar(user.name, '#0c9b88', 'pf-ava')}
      <div class="pf-meta"><h1>${esc(user.name)}</h1><div class="cat">@${esc(user.username)} · ${esc(user.email)}</div></div>
    </div>
    <div class="card">
      <h2>Hisob</h2>
      <div class="attrs">
        <div class="attr"><span>Rol</span><b>${esc(user.role === 'admin' ? 'Super admin' : user.role === 'seller' ? 'Sotuvchi' : 'Xaridor')}</b></div>
        <div class="attr"><span>Holat</span><b>${esc(user.status === 'active' ? 'Faol' : 'Bloklangan')}</b></div>
        ${store ? `<div class="attr"><span>Do‘kon</span><b>${esc(store.title)}</b></div>` : ''}
      </div>
    </div>
    <div class="card">
      <h2>Boshqaruv</h2>
      <div style="display:flex;flex-direction:column;gap:9px">
        ${
          store
            ? `<a class="btn btn-grad" href="/seller">${icon('shop')} Do‘kon kabineti (${counts.all} e‘lon)</a>`
            : `<a class="btn btn-grad" href="/seller/create-store">${icon('shop')} Do‘kon ochish</a>`
        }
        <a class="btn btn-line" href="/new">${icon('plus')} E‘lon joylash</a>
        <a class="btn btn-line" href="/saved">${icon('bookmark')} Saqlangan</a>
        ${user.role === 'admin' ? `<a class="btn btn-line" href="/admin">${icon('shield')} Super admin panel</a>` : ''}
        <form method="post" action="/logout"><button class="btn btn-danger full" type="submit">${icon('logout')} Chiqish</button></form>
      </div>
    </div>`;
  return layout({ title: 'Profil', body, user, active: 'me', unread });
}

/* ---------- kirish / ro'yxatdan o'tish ---------- */
export function authPage({ mode, error = '', next = '', values = {} }) {
  const isLogin = mode === 'login';
  const body = `
    <div class="card" style="max-width:420px;margin:24px auto">
      <h2>${isLogin ? 'Kirish' : 'Ro‘yxatdan o‘tish'}</h2>
      ${error ? `<div class="alert-msg err">${esc(error)}</div>` : ''}
      <form method="post" action="/${isLogin ? 'login' : 'register'}${next ? `?next=${encodeURIComponent(next)}` : ''}">
        <div class="fgrid">
          ${
            isLogin
              ? `<div class="field full"><label>Email yoki username</label>
                   <input name="login" value="${esc(values.login || '')}" required autofocus></div>`
              : `<div class="field full"><label>Ism</label><input name="name" value="${esc(values.name || '')}" required autofocus></div>
                 <div class="field full"><label>Username</label><input name="username" value="${esc(values.username || '')}" required pattern="[a-zA-Z0-9_]{3,20}"></div>
                 <div class="field full"><label>Email</label><input type="email" name="email" value="${esc(values.email || '')}" required></div>`
          }
          <div class="field full"><label>Parol</label><input type="password" name="password" required minlength="6"></div>
          ${
            isLogin
              ? ''
              : `<div class="field full"><label>Maqsad</label>
                   <select name="role"><option value="buyer">Xaridor — izlash uchun</option>
                   <option value="seller">Sotuvchi — e‘lon joylash uchun</option></select></div>`
          }
        </div>
        <button class="btn btn-grad full" style="margin-top:16px" type="submit">${isLogin ? 'Kirish' : 'Ro‘yxatdan o‘tish'}</button>
      </form>
      <p class="muted" style="margin-top:14px;font-size:12.5px">
        ${
          isLogin
            ? `Hisobingiz yo‘qmi? <a href="/register" style="color:var(--brand);font-weight:800">Ro‘yxatdan o‘tish</a>`
            : `Hisobingiz bormi? <a href="/login" style="color:var(--brand);font-weight:800">Kirish</a>`
        }
      </p>
    </div>`;
  return layout({ title: isLogin ? 'Kirish' : 'Ro‘yxatdan o‘tish', body, active: 'me' });
}

/* ---------- shikoyat ---------- */
export function reportPage({ user, listing, unread }) {
  const reasons = ['Firibgarlik shubhasi', 'Taqiqlangan mahsulot', 'Noto‘g‘ri kategoriya', 'Yolg‘on ma‘lumot', 'Boshqa'];
  const body = `
    <div class="card" style="max-width:460px;margin:0 auto">
      <h2>Shikoyat yuborish</h2>
      <p class="muted" style="margin-bottom:14px;font-size:12.5px">E‘lon: <b>${esc(listing.title)}</b></p>
      <form method="post" action="/report/${listing.id}">
        <div class="field full"><label>Sabab</label>
          <select name="reason" required>${reasons.map((r) => `<option>${esc(r)}</option>`).join('')}</select></div>
        <button class="btn btn-grad full" style="margin-top:14px" type="submit">Yuborish</button>
      </form>
    </div>`;
  return layout({ title: 'Shikoyat', body, user, active: '', unread });
}
