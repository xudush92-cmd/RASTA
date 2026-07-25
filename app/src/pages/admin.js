import { esc } from '../http.js';
import { icon, art, avatar, money, layout, timeAgo, STATUS_LABEL, TYPE_LABEL, ART_KINDS } from '../ui.js';

const adminNav = (active, stats) => {
  const items = [
    ['/admin', 'grid', 'Umumiy holat', 0],
    ['/admin/moderation', 'shield', 'Moderatsiya', stats?.pending || 0],
    ['/admin/listings', 'box', 'E‘lonlar', 0],
    ['/admin/stores', 'shop', 'Do‘konlar', 0],
    ['/admin/users', 'users', 'Foydalanuvchilar', 0],
    ['/admin/reports', 'alert', 'Shikoyatlar', stats?.reports || 0],
    ['/admin/categories', 'layers', 'Kategoriyalar', 0],
    ['/admin/audit', 'clock', 'Audit log', 0],
  ];
  return `<nav class="subnav">${items
    .map(
      ([href, ic, label, count]) =>
        `<a href="${href}" class="${active === href ? 'on' : ''}">${icon(ic)} ${label}${
          count ? `<span class="c">${count}</span>` : ''
        }</a>`
    )
    .join('')}</nav>`;
};

const shell = (title, body, { user, active, stats, flash }) =>
  layout({ title, body, user, shell: 'admin', subnav: adminNav(active, stats), wide: true, flash });

/* ---------- umumiy holat ---------- */
export function adminDashboard({ user, stats, recent, flash }) {
  const body = `
    <div class="page-head"><div><h1>Platforma holati</h1><p>RASTA bo‘yicha umumiy nazorat</p></div></div>
    <div class="kpis">
      <div class="kpi"><span>Foydalanuvchilar</span><b>${stats.users}</b></div>
      <div class="kpi"><span>Do‘konlar</span><b>${stats.stores}</b></div>
      <div class="kpi"><span>Faol e‘lonlar</span><b>${stats.listings}</b></div>
      <div class="kpi"><span>Xabarlar</span><b>${stats.messages}</b></div>
    </div>
    <div class="card">
      <h2>Zudlik bilan</h2>
      <a class="thread-item" href="/admin/moderation"><div><b>${stats.pending} e‘lon moderatsiyada</b>
        <p>Tasdiqlash yoki rad etish kerak</p></div><span class="t">${icon('next')}</span></a>
      <a class="thread-item" href="/admin/reports"><div><b>${stats.reports} yangi shikoyat</b>
        <p>Foydalanuvchi murojaatlari</p></div><span class="t">${icon('next')}</span></a>
    </div>
    <div class="card">
      <h2>So‘nggi harakatlar</h2>
      ${
        recent.length
          ? `<div class="tablewrap"><div class="scroll"><table>
              <thead><tr><th>Vaqt</th><th>Xodim</th><th>Amal</th><th>Obyekt</th></tr></thead>
              <tbody>${recent
                .map(
                  (a) => `<tr><td>${esc(timeAgo(a.created_at))}</td><td>${esc(a.actor_name)}</td>
                    <td><b>${esc(a.action)}</b></td><td class="muted">${esc(a.target)}</td></tr>`
                )
                .join('')}</tbody></table></div></div>`
          : '<p class="muted" style="font-size:13px">Hozircha yozuv yo‘q.</p>'
      }
    </div>`;
  return shell('Umumiy holat', body, { user, active: '/admin', stats, flash });
}

/* ---------- moderatsiya ---------- */
export function adminModeration({ user, queue, stats, flash }) {
  const body = `
    <div class="page-head"><div><h1>Moderatsiya</h1>
      <p>Yangi va tahrirlangan e‘lonlarni tasdiqlang yoki rad eting</p></div></div>
    ${
      queue.length
        ? `<div class="tablewrap"><div class="scroll"><table>
            <thead><tr><th>E‘lon</th><th>Kim</th><th>Kategoriya</th><th>Yuborilgan</th><th>Amal</th></tr></thead>
            <tbody>${queue
              .map(
                (l) => `<tr>
                  <td><div class="tprod">
                    <div class="thumb">${
                      l.cover ? `<img src="/uploads/${esc(l.cover)}" alt="">` : art(l.art_kind, l.art_color, l.art_bg)
                    }</div>
                    <div><b><a href="/listing/${l.id}">${esc(l.title)}</a></b>
                      <small>${money(l.price, l.price_note)} · ${esc(TYPE_LABEL[l.type])}</small></div>
                  </div></td>
                  <td>${esc(l.store_title || l.owner_name)}</td>
                  <td>${esc(l.category_name || '—')}</td>
                  <td>${esc(timeAgo(l.created_at))}</td>
                  <td><div class="row-actions">
                    <form method="post" action="/admin/listing/${l.id}/approve" style="display:inline">
                      <button class="btn btn-grad sm" type="submit">Tasdiqlash</button></form>
                    <form method="post" action="/admin/listing/${l.id}/reject" style="display:inline">
                      <input type="hidden" name="reason" value="Qoidalarga mos emas">
                      <button class="btn btn-danger sm" type="submit">Rad etish</button></form>
                  </div></td>
                </tr>`
              )
              .join('')}</tbody></table></div></div>`
        : `<div class="empty"><h3>Navbat bo‘sh</h3><p>Tekshirishni kutayotgan e‘lon yo‘q.</p></div>`
    }`;
  return shell('Moderatsiya', body, { user, active: '/admin/moderation', stats, flash });
}

/* ---------- barcha e'lonlar ---------- */
export function adminListings({ user, listings, stats, status, flash }) {
  const tab = (label, value) =>
    `<a class="pill ${status === value ? 'on' : ''}" href="/admin/listings${value ? `?status=${value}` : ''}">${label}</a>`;
  const body = `
    <div class="page-head"><div><h1>E‘lonlar</h1><p>Platformadagi barcha e‘lonlar</p></div></div>
    <div class="chips">${tab('Hammasi', '')}${tab('Faol', 'active')}${tab('Tekshiruvda', 'pending')}${tab('Rad etilgan', 'rejected')}${tab('Yashirilgan', 'hidden')}</div>
    ${
      listings.length
        ? `<div class="tablewrap"><div class="scroll"><table>
            <thead><tr><th>E‘lon</th><th>Kim</th><th>Holat</th><th>Narx</th><th>Amal</th></tr></thead>
            <tbody>${listings
              .map(
                (l) => `<tr>
                  <td><div class="tprod">
                    <div class="thumb">${
                      l.cover ? `<img src="/uploads/${esc(l.cover)}" alt="">` : art(l.art_kind, l.art_color, l.art_bg)
                    }</div>
                    <div><b><a href="/listing/${l.id}">${esc(l.title)}</a></b>
                      <small>${esc(l.category_name || TYPE_LABEL[l.type])}</small></div>
                  </div></td>
                  <td>${esc(l.store_title || l.owner_name)}</td>
                  <td><span class="st ${l.status}">${STATUS_LABEL[l.status]}</span></td>
                  <td>${money(l.price, l.price_note)}</td>
                  <td><div class="row-actions">
                    ${
                      l.status === 'hidden'
                        ? `<form method="post" action="/admin/listing/${l.id}/approve" style="display:inline">
                             <button class="btn btn-line sm" type="submit">Tiklash</button></form>`
                        : `<form method="post" action="/admin/listing/${l.id}/hide" style="display:inline">
                             <button class="btn btn-line sm" type="submit">Yashirish</button></form>`
                    }
                  </div></td>
                </tr>`
              )
              .join('')}</tbody></table></div></div>`
        : `<div class="empty"><h3>E‘lon yo‘q</h3><p>Bu bo‘limda e‘lon topilmadi.</p></div>`
    }`;
  return shell('E‘lonlar', body, { user, active: '/admin/listings', stats, flash });
}

/* ---------- do'konlar ---------- */
export function adminStores({ user, stores, stats, flash }) {
  const body = `
    <div class="page-head"><div><h1>Do‘konlar</h1><p>Tasdiqlash, kuzatish va bloklash</p></div></div>
    <div class="tablewrap"><div class="scroll"><table>
      <thead><tr><th>Do‘kon</th><th>Egasi</th><th>E‘lon</th><th>Obunachi</th><th>Holat</th><th>Amal</th></tr></thead>
      <tbody>${stores
        .map(
          (s) => `<tr>
            <td><div class="tprod">${avatar(s.title, s.color)}
              <div><b><a href="/store/${esc(s.slug)}">${esc(s.title)}</a></b><small>@${esc(s.slug)}</small></div>
            </div></td>
            <td>${esc(s.owner_name)}</td><td>${s.listings}</td><td>${s.followers}</td>
            <td><span class="st ${s.status === 'active' ? 'active' : s.status === 'blocked' ? 'blocked' : 'pending'}">${
              s.status === 'active' ? 'Tasdiqlangan' : s.status === 'blocked' ? 'Bloklangan' : 'Tekshiruvda'
            }</span></td>
            <td><div class="row-actions">
              ${
                s.status !== 'active'
                  ? `<form method="post" action="/admin/store/${s.id}/verify" style="display:inline">
                       <button class="btn btn-grad sm" type="submit">Tasdiqlash</button></form>`
                  : `<form method="post" action="/admin/store/${s.id}/block" style="display:inline">
                       <button class="btn btn-danger sm" type="submit" data-confirm="Do‘kon bloklansinmi?">Bloklash</button></form>`
              }
            </div></td>
          </tr>`
        )
        .join('')}</tbody></table></div></div>`;
  return shell('Do‘konlar', body, { user, active: '/admin/stores', stats, flash });
}

/* ---------- foydalanuvchilar ---------- */
export function adminUsers({ user, users, stats, flash }) {
  const roleLabel = { admin: 'Super admin', seller: 'Sotuvchi', buyer: 'Xaridor' };
  const body = `
    <div class="page-head"><div><h1>Foydalanuvchilar</h1><p>Hisoblar, rollar va holat</p></div></div>
    <div class="tablewrap"><div class="scroll"><table>
      <thead><tr><th>Ism</th><th>Username</th><th>Email</th><th>Rol</th><th>Holat</th><th>Amal</th></tr></thead>
      <tbody>${users
        .map(
          (u) => `<tr>
            <td><div class="tprod">${avatar(u.name, '#7a8690')}<b>${esc(u.name)}</b></div></td>
            <td>@${esc(u.username)}</td><td class="muted">${esc(u.email)}</td>
            <td>${esc(roleLabel[u.role])}</td>
            <td><span class="st ${u.status === 'active' ? 'active' : 'blocked'}">${
              u.status === 'active' ? 'Faol' : 'Bloklangan'
            }</span></td>
            <td><div class="row-actions">
              ${
                u.id === user.id
                  ? '<span class="muted">— siz —</span>'
                  : `<form method="post" action="/admin/user/${u.id}/toggle" style="display:inline">
                       <button class="btn ${u.status === 'active' ? 'btn-danger' : 'btn-line'} sm" type="submit">
                         ${u.status === 'active' ? 'Bloklash' : 'Blokni ochish'}</button></form>`
              }
            </div></td>
          </tr>`
        )
        .join('')}</tbody></table></div></div>`;
  return shell('Foydalanuvchilar', body, { user, active: '/admin/users', stats, flash });
}

/* ---------- shikoyatlar ---------- */
export function adminReports({ user, reports, stats, flash }) {
  const body = `
    <div class="page-head"><div><h1>Shikoyatlar</h1><p>Foydalanuvchi va tizim signallari</p></div></div>
    ${
      reports.length
        ? `<div class="tablewrap"><div class="scroll"><table>
            <thead><tr><th>Sabab</th><th>E‘lon</th><th>Yuboruvchi</th><th>Holat</th><th>Amal</th></tr></thead>
            <tbody>${reports
              .map(
                (r) => `<tr>
                  <td><b>${esc(r.reason)}</b></td>
                  <td>${r.listing_id ? `<a href="/listing/${r.listing_id}">${esc(r.listing_title || '—')}</a>` : '—'}</td>
                  <td>${r.reporter ? `@${esc(r.reporter)}` : '—'}</td>
                  <td><span class="st ${r.status === 'new' ? 'pending' : 'draft'}">${
                    r.status === 'new' ? 'Yangi' : r.status === 'reviewed' ? 'Ko‘rildi' : 'Yopilgan'
                  }</span></td>
                  <td><div class="row-actions">
                    ${
                      r.listing_id
                        ? `<form method="post" action="/admin/listing/${r.listing_id}/hide" style="display:inline">
                             <button class="btn btn-danger sm" type="submit">E‘lonni yashirish</button></form>`
                        : ''
                    }
                    <form method="post" action="/admin/report/${r.id}/close" style="display:inline">
                      <button class="btn btn-line sm" type="submit">Yopish</button></form>
                  </div></td>
                </tr>`
              )
              .join('')}</tbody></table></div></div>`
        : `<div class="empty"><h3>Shikoyat yo‘q</h3><p>Hozircha signal kelmagan.</p></div>`
    }`;
  return shell('Shikoyatlar', body, { user, active: '/admin/reports', stats, flash });
}

/* ---------- kategoriyalar (CRUD) ---------- */
export function adminCategories({ user, categories, subs, stats, editing, flash }) {
  const form = (cat) => `
    <form method="post" action="/admin/categories${cat ? `/${cat.id}` : ''}" class="card">
      <h2>${cat ? `«${esc(cat.name)}» tahrirlash` : 'Yangi kategoriya'}</h2>
      <div class="fgrid">
        <div class="field full"><label>Nomi *</label>
          <input name="name" value="${esc(cat?.name || '')}" required maxlength="40"></div>
        <div class="field"><label>Surat turi</label>
          <select name="art_kind">${ART_KINDS.map(
            (k) => `<option${(cat?.art_kind || 'all') === k ? ' selected' : ''}>${esc(k)}</option>`
          ).join('')}</select></div>
        <div class="field"><label>Fon rangi</label>
          <input name="art_bg" value="${esc(cat?.art_bg || '#eef2f1')}"></div>
        <div class="field full"><label>Ichki bo‘limlar (vergul bilan)</label>
          <input name="subs" value="${esc(cat ? (subs[cat.id] || []).join(', ') : '')}" placeholder="Sotuv, Ijara">
          <span class="hint">Mijoz kategoriya tanlaganda shu filtrlar chiqadi.</span></div>
      </div>
      <div class="form-actions">
        ${cat ? `<a class="btn btn-line" href="/admin/categories">Bekor</a>` : ''}
        <button class="btn btn-grad" type="submit">${cat ? 'Saqlash' : 'Qo‘shish'}</button>
      </div>
    </form>`;

  const body = `
    <div class="page-head"><div><h1>Kategoriyalar</h1>
      <p>Qo‘shish, tahrirlash, o‘chirish va ichki bo‘limlar</p></div></div>
    ${form(editing)}
    <div class="tablewrap"><div class="scroll"><table>
      <thead><tr><th>Kategoriya</th><th>E‘lonlar</th><th>Ichki bo‘limlar</th><th>Amal</th></tr></thead>
      <tbody>${categories
        .map(
          (c) => `<tr>
            <td><div class="tprod"><div class="thumb" style="background:${esc(c.art_bg)}">${art(
              c.art_kind,
              c.art_color,
              ''
            )}</div><b>${esc(c.name)}</b></div></td>
            <td>${c.listings}</td>
            <td>${esc((subs[c.id] || []).join(', ') || '—')}</td>
            <td><div class="row-actions">
              <a class="btn btn-line sm" href="/admin/categories?edit=${c.id}">Tahrirlash</a>
              <form method="post" action="/admin/categories/${c.id}/delete" style="display:inline">
                <button class="btn btn-danger sm" type="submit"
                  data-confirm="«${esc(c.name)}» o‘chirilsinmi? E‘lonlar kategoriyasiz qoladi.">O‘chirish</button></form>
            </div></td>
          </tr>`
        )
        .join('')}</tbody></table></div></div>`;
  return shell('Kategoriyalar', body, { user, active: '/admin/categories', stats, flash });
}

/* ---------- audit log ---------- */
export function adminAudit({ user, logs, stats }) {
  const body = `
    <div class="page-head"><div><h1>Audit log</h1>
      <p>Kim, qachon, nima o‘zgartirgani — o‘zgartirilmaydigan yozuv</p></div></div>
    <div class="tablewrap"><div class="scroll"><table>
      <thead><tr><th>Vaqt</th><th>Xodim</th><th>Rol</th><th>Amal</th><th>Obyekt</th><th>Tafsilot</th><th>IP</th></tr></thead>
      <tbody>${logs
        .map(
          (a) => `<tr><td>${esc(a.created_at)}</td><td>${esc(a.actor_name)}</td><td>${esc(a.actor_role)}</td>
            <td><b>${esc(a.action)}</b></td><td>${esc(a.target)}</td>
            <td class="muted">${esc(a.details)}</td><td class="muted">${esc(a.ip)}</td></tr>`
        )
        .join('')}</tbody></table></div></div>
    <div class="note" style="margin-top:14px">${icon('info')}
      <span>Audit yozuvlari <b>immutable</b> — tahrirlab yoki o‘chirib bo‘lmaydi.</span></div>`;
  return shell('Audit log', body, { user, active: '/admin/audit', stats });
}
