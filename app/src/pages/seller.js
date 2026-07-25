import { esc } from '../http.js';
import { icon, art, money, layout, timeAgo, STATUS_LABEL, TYPE_LABEL, ART_KINDS } from '../ui.js';
import * as q from '../queries.js';

/* ---------- turga qarab maydonlar ---------- */
export const TYPE_FIELDS = {
  product: [
    { key: 'brend', label: 'Brend' },
    { key: 'model', label: 'Model' },
    { key: 'kafolat', label: 'Kafolat' },
    { key: 'sku', label: 'SKU' },
  ],
  property: [
    { key: 'xonalar', label: 'Xonalar soni', required: true },
    { key: 'maydon', label: 'Maydon (m²)', required: true },
    { key: 'qavat', label: 'Qavat (masalan 4/9)' },
    { key: 'tamir', label: 'Ta‘mir holati' },
  ],
  car: [
    { key: 'marka', label: 'Marka', required: true },
    { key: 'yil', label: 'Ishlab chiqarilgan yil', required: true },
    { key: 'probeg', label: 'Probeg (km)' },
    { key: 'yoqilgi', label: 'Yoqilg‘i turi' },
  ],
  service: [
    { key: 'xizmat_turi', label: 'Xizmat turi', required: true },
    { key: 'tajriba', label: 'Tajriba (yil)' },
    { key: 'hudud', label: 'Xizmat hududi' },
  ],
};

/** Har bir turda qaysi umumiy maydonlar ko'rinadi. */
const SHOWS = {
  product: { condition: true, stock: true, deal: false },
  property: { condition: false, stock: false, deal: true },
  car: { condition: true, stock: false, deal: false },
  service: { condition: false, stock: false, deal: false },
};

const sellerNav = (active) => {
  const items = [
    ['/seller', 'grid', 'Bugungi holat', ''],
    ['/seller/listings', 'box', 'E‘lonlar', ''],
    ['/seller/messages', 'chat', 'Murojaatlar', ''],
    ['/new', 'plus', 'E‘lon qo‘shish', ''],
  ];
  return `<nav class="subnav">${items
    .map(
      ([href, ic, label]) =>
        `<a href="${href}" class="${active === href ? 'on' : ''}">${icon(ic)} ${label}</a>`
    )
    .join('')}</nav>`;
};

/* ---------- kabinet bosh sahifasi ---------- */
export function sellerDashboard({ user, store, counts, listings, unreadLeads, views, flash }) {
  const tasks = [];
  if (counts.pending) tasks.push([`${counts.pending} e‘lon tekshiruvda`, 'Moderatsiya javobini kutmoqda', '/seller/listings?status=pending', 'warn']);
  if (counts.rejected) tasks.push([`${counts.rejected} e‘lon rad etilgan`, 'Sababini ko‘rib tuzating', '/seller/listings?status=rejected', 'danger']);
  if (counts.draft) tasks.push([`${counts.draft} qoralama`, 'Tugallanmagan e‘lonlar', '/seller/listings?status=draft', '']);
  if (unreadLeads) tasks.push([`${unreadLeads} javobsiz murojaat`, 'Xaridorlar javob kutmoqda', '/seller/messages', 'danger']);

  const body = `
    <div class="page-head">
      <div><h1>${esc(store.title)}</h1><p>${
        store.status === 'active' ? 'Tasdiqlangan do‘kon' : 'Do‘kon tasdiq kutmoqda'
      } · ${esc(store.area || '—')}</p></div>
      <a class="btn btn-grad sm" href="/new">${icon('plus')} E‘lon qo‘shish</a>
    </div>

    <div class="kpis">
      <div class="kpi"><span>Faol e‘lon</span><b>${counts.active}</b></div>
      <div class="kpi"><span>Ko‘rishlar</span><b>${views}</b></div>
      <div class="kpi"><span>Tekshiruvda</span><b>${counts.pending}</b></div>
      <div class="kpi"><span>Murojaat</span><b>${unreadLeads}</b></div>
    </div>

    <div class="card">
      <h2>Bugungi vazifalar</h2>
      ${
        tasks.length
          ? tasks
              .map(
                ([title, sub, href]) =>
                  `<a class="thread-item" href="${href}"><div><b>${esc(title)}</b><p>${esc(sub)}</p></div>
                   <span class="t">${icon('next')}</span></a>`
              )
              .join('')
          : '<p class="muted" style="font-size:13px">Hammasi joyida — bajarilishi kerak vazifa yo‘q.</p>'
      }
    </div>

    <div class="card">
      <h2>So‘nggi e‘lonlar</h2>
      ${
        listings.length
          ? `<div class="tablewrap"><div class="scroll">${listingTable(listings.slice(0, 5))}</div></div>`
          : `<p class="muted" style="font-size:13px">Hali e‘lon joylamadingiz. <a href="/new" style="color:var(--brand);font-weight:800">Birinchisini qo‘shing</a>.</p>`
      }
    </div>`;

  return layout({
    title: 'Do‘kon kabineti',
    body,
    user,
    shell: 'seller',
    subnav: sellerNav('/seller'),
    wide: true,
    flash,
  });
}

function listingTable(listings) {
  return `<table>
    <thead><tr><th>E‘lon</th><th>Holat</th><th>Narx</th><th>Ko‘rish</th><th>Amal</th></tr></thead>
    <tbody>${listings
      .map(
        (l) => `<tr>
          <td><div class="tprod">
            <div class="thumb">${
              l.cover ? `<img src="/uploads/${esc(l.cover)}" alt="">` : art(l.art_kind, l.art_color, l.art_bg)
            }</div>
            <div><b>${esc(l.title)}</b><small>${esc(l.category_name || TYPE_LABEL[l.type])} · ${esc(timeAgo(l.updated_at))}</small></div>
          </div></td>
          <td><span class="st ${l.status}">${STATUS_LABEL[l.status]}</span></td>
          <td><b>${money(l.price, l.price_note)}</b></td>
          <td>${l.views}</td>
          <td><div class="row-actions">
            <a class="btn btn-line sm" href="/listing/${l.id}/edit">Tahrirlash</a>
            <form method="post" action="/listing/${l.id}/delete" style="display:inline">
              <button class="btn btn-danger sm" type="submit" data-confirm="«${esc(l.title)}» o‘chirilsinmi?">O‘chirish</button>
            </form>
          </div></td>
        </tr>`
      )
      .join('')}</tbody></table>`;
}

/* ---------- e'lonlar ro'yxati ---------- */
export function sellerListings({ user, store, listings, counts, status, flash }) {
  const tab = (label, value) =>
    `<a class="pill ${status === value ? 'on' : ''}" href="/seller/listings${value ? `?status=${value}` : ''}">${label}</a>`;

  const body = `
    <div class="page-head">
      <div><h1>E‘lonlar</h1><p>Joylashtirish, tahrirlash va holatni kuzatish</p></div>
      <a class="btn btn-grad sm" href="/new">${icon('plus')} Yangi</a>
    </div>
    <div class="chips">
      ${tab(`Hammasi ${counts.all}`, '')}
      ${tab(`Faol ${counts.active}`, 'active')}
      ${tab(`Tekshiruvda ${counts.pending}`, 'pending')}
      ${tab(`Qoralama ${counts.draft}`, 'draft')}
      ${tab(`Rad etilgan ${counts.rejected}`, 'rejected')}
    </div>
    ${
      listings.length
        ? `<div class="tablewrap"><div class="scroll">${listingTable(listings)}</div></div>`
        : `<div class="empty"><h3>E‘lon yo‘q</h3><p>Bu bo‘limda e‘lon topilmadi.</p></div>`
    }`;

  return layout({
    title: 'E‘lonlar',
    body,
    user,
    shell: 'seller',
    subnav: sellerNav('/seller/listings'),
    wide: true,
    flash,
  });
}

/* ---------- e'lon formasi (yangi / tahrirlash) ---------- */
export function listingForm({ user, store, type, listing = null, attrs = {}, images = [], categories, error = '' }) {
  const isEdit = !!listing;
  const show = SHOWS[type];
  const value = (key, fallback = '') => esc(listing?.[key] ?? fallback);

  const typeButtons = ['product', 'property', 'car', 'service']
    .map(
      (t) =>
        `<button type="button" class="type-btn ${t === type ? 'on' : ''}" data-type-switch="${t}">${TYPE_LABEL[t]}</button>`
    )
    .join('');

  const titleLabel = {
    product: 'Mahsulot nomi',
    property: 'E‘lon sarlavhasi',
    car: 'Avto (marka va model)',
    service: 'Xizmat nomi',
  }[type];

  const extra = TYPE_FIELDS[type]
    .map(
      (f) => `<div class="field">
        <label>${esc(f.label)}${f.required ? ' *' : ''}</label>
        <input name="attr_${f.key}" value="${esc(attrs[f.key] || '')}"${f.required ? ' required' : ''}>
      </div>`
    )
    .join('');

  const body = `
    <div class="page-head">
      <div><h1>${isEdit ? 'E‘lonni tahrirlash' : 'Yangi e‘lon'}</h1>
        <p>${isEdit ? 'O‘zgarishdan keyin e‘lon qayta tekshiriladi' : 'Turini tanlang — forma o‘zi moslashadi'}</p></div>
    </div>
    ${error ? `<div class="alert-msg err">${esc(error)}</div>` : ''}
    ${isEdit ? '' : `<div class="type-sel">${typeButtons}</div>`}

    <form method="post" action="${isEdit ? `/listing/${listing.id}/edit` : '/new'}" enctype="multipart/form-data">
      <input type="hidden" name="type" value="${esc(type)}">
      <div class="card">
        <h2>Asosiy ma‘lumot</h2>
        <div class="fgrid">
          <div class="field full"><label>${esc(titleLabel)} *</label>
            <input name="title" value="${value('title')}" required maxlength="120"></div>

          <div class="field"><label>Kategoriya *</label>
            <select name="category_id" required>
              <option value="">— tanlang —</option>
              ${categories
                .map(
                  (c) =>
                    `<option value="${c.id}"${listing?.category_id === c.id ? ' selected' : ''}>${esc(c.name)}</option>`
                )
                .join('')}
            </select></div>

          <div class="field"><label>Hudud *</label>
            <input name="area" value="${value('area')}" required placeholder="Chilonzor, Toshkent"></div>

          ${
            show.deal
              ? `<div class="field"><label>Bitim turi *</label>
                   <select name="deal" required>
                     <option${listing?.deal === 'Sotuv' ? ' selected' : ''}>Sotuv</option>
                     <option${listing?.deal === 'Ijara' ? ' selected' : ''}>Ijara</option>
                   </select></div>`
              : ''
          }
          ${
            show.condition
              ? `<div class="field"><label>Holati *</label>
                   <select name="condition" required>
                     <option${listing?.condition === 'Yangi' ? ' selected' : ''}>Yangi</option>
                     <option${listing?.condition === 'Ishlatilgan' ? ' selected' : ''}>Ishlatilgan</option>
                   </select></div>`
              : ''
          }

          <div class="field"><label>Narx (so‘m)</label>
            <input name="price" type="number" min="0" step="1000" value="${value('price')}" placeholder="bo‘sh = kelishiladi"></div>
          <div class="field"><label>Narx izohi</label>
            <input name="price_note" value="${value('price_note')}" placeholder="${
              type === 'service' ? 'soatbay / ish hajmiga' : type === 'property' ? 'oyiga' : 'kelishiladi'
            }"></div>

          ${
            show.stock
              ? `<div class="field"><label>Mavjudlik</label>
                   <input name="stock" value="${value('stock')}" placeholder="masalan: 12 dona"></div>`
              : ''
          }
        </div>
      </div>

      <div class="card">
        <h2>${esc(TYPE_LABEL[type])} tafsilotlari</h2>
        <div class="fgrid">${extra}</div>
      </div>

      <div class="card">
        <h2>Tavsif va topilish</h2>
        <div class="fgrid">
          <div class="field full"><label>Tavsif *</label>
            <textarea name="description" required maxlength="4000">${value('description')}</textarea></div>
          <div class="field full"><label>Kalit so‘zlar</label>
            <input name="keywords" value="${value('keywords')}" placeholder="telefon, samsung, android">
            <span class="hint">Vergul bilan ajrating — mijoz shu so‘zlar bo‘yicha ham topadi.</span></div>
          <div class="field full"><label>Chizma turi (rasm yuklamasangiz shu ko‘rinadi)</label>
            <select name="art_kind">
              ${ART_KINDS.map(
                (k) => `<option${(listing?.art_kind || 'phone') === k ? ' selected' : ''}>${esc(k)}</option>`
              ).join('')}
            </select></div>
        </div>
      </div>

      <div class="card">
        <h2>Rasmlar</h2>
        ${
          images.length
            ? `<div class="img-list">${images
                .map(
                  (img) => `<div class="img-item"><img src="/uploads/${esc(img.path)}" alt="">
                    <a href="/listing/${listing.id}/image/${img.id}/delete" title="O‘chirish">×</a></div>`
                )
                .join('')}</div><p class="hint" style="margin:8px 0">Yangi rasm yuklasangiz, mavjudlariga qo‘shiladi.</p>`
            : ''
        }
        <label class="upload" data-preview="#imgPreview">
          ${icon('upload')}<b>Rasm tanlash uchun bosing</b>
          <span class="hint">JPG, PNG yoki WebP · 10 MB gacha · bir nechta rasm avtomatik slayd bo‘ladi</span>
          <input type="file" name="images" accept="image/*" multiple>
        </label>
        <div class="img-list" id="imgPreview"></div>
      </div>

      <div class="form-actions">
        <button class="btn btn-line" name="status" value="draft" type="submit">Qoralama saqlash</button>
        <button class="btn btn-grad" name="status" value="pending" type="submit">
          ${isEdit ? 'Saqlash va yuborish' : 'Moderatsiyaga yuborish'}</button>
      </div>
    </form>`;

  return layout({
    title: isEdit ? 'Tahrirlash' : 'Yangi e‘lon',
    body,
    user,
    shell: store ? 'seller' : 'buyer',
    subnav: store ? sellerNav('/new') : '',
    active: 'me',
  });
}

/* ---------- do'kon ochish ---------- */
export function createStorePage({ user, error = '' }) {
  const body = `
    <div class="card" style="max-width:520px;margin:0 auto">
      <h2>Do‘kon ochish</h2>
      <p class="muted" style="margin-bottom:14px;font-size:12.5px">
        Do‘kon ochilgach e‘lonlaringiz «Do‘kon» yorlig‘i bilan chiqadi va obunachi yig‘asiz.</p>
      ${error ? `<div class="alert-msg err">${esc(error)}</div>` : ''}
      <form method="post" action="/seller/create-store">
        <div class="fgrid">
          <div class="field full"><label>Do‘kon nomi *</label><input name="title" required maxlength="60"></div>
          <div class="field full"><label>Manzil (username) *</label>
            <input name="slug" required pattern="[a-z0-9_-]{3,30}" placeholder="texnomart">
            <span class="hint">Faqat kichik harf, raqam, - va _</span></div>
          <div class="field full"><label>Yo‘nalish</label><input name="category" placeholder="Elektronika"></div>
          <div class="field full"><label>Hudud</label><input name="area" placeholder="Chilonzor, Toshkent"></div>
          <div class="field full"><label>Tavsif</label><textarea name="bio" maxlength="500"></textarea></div>
        </div>
        <button class="btn btn-grad full" style="margin-top:16px" type="submit">Do‘kon yaratish</button>
      </form>
    </div>`;
  return layout({ title: 'Do‘kon ochish', body, user, active: 'me' });
}

/* ---------- murojaatlar ---------- */
export function sellerMessages({ user, store, list }) {
  const body = `
    <div class="page-head"><div><h1>Murojaatlar</h1>
      <p>Bu buyurtma emas — xaridorlarning aloqa so‘rovlari</p></div></div>
    ${
      list.length
        ? list
            .map(
              (t) => `<a class="thread-item" href="/messages/${t.peer_id}">
                <div><b>${esc(t.peer_name)}</b><p>${esc(t.body.slice(0, 70))}</p></div>
                <span class="t">${esc(timeAgo(t.created_at))}${t.unread ? ` · ${t.unread} yangi` : ''}</span></a>`
            )
            .join('')
        : `<div class="empty"><h3>Murojaat yo‘q</h3><p>Xaridorlar e‘lon sahifasidan yozadi.</p></div>`
    }`;
  return layout({
    title: 'Murojaatlar',
    body,
    user,
    shell: 'seller',
    subnav: sellerNav('/seller/messages'),
    wide: true,
  });
}
