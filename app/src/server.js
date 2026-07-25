import { createServer } from 'node:http';
import { readFile, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join, extname, basename } from 'node:path';
import { randomUUID } from 'node:crypto';

import { ROOT, UPLOAD_DIR, one, all, run, insert, audit } from './db.js';
import {
  esc, html, json, redirect, notFound, parseCookies, cookie, clearCookie, parseForm,
} from './http.js';
import {
  SESSION_COOKIE, userFromSession, createSession, destroySession,
  registerUser, findUserByLogin, verifyPassword, isAdmin, storeOf,
} from './auth.js';
import * as Q from './queries.js';
import * as B from './pages/buyer.js';
import * as S from './pages/seller.js';
import * as A from './pages/admin.js';

const PORT = Number(process.env.PORT || 3000);
const MIME = {
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
};
const IMAGE_TYPES = {
  'image/png': '.png',
  'image/jpeg': '.jpg',
  'image/webp': '.webp',
  'image/gif': '.gif',
};

/* ---------- yordamchilar ---------- */
const clientIp = (req) =>
  (req.headers['x-forwarded-for'] || '').split(',')[0].trim() || req.socket.remoteAddress || '';

const flashFrom = (url) => {
  const ok = url.searchParams.get('ok');
  const err = url.searchParams.get('err');
  if (ok) return { type: 'ok', text: ok };
  if (err) return { type: 'err', text: err };
  return null;
};

const withMsg = (path, type, text) => `${path}${path.includes('?') ? '&' : '?'}${type}=${encodeURIComponent(text)}`;

function requireUser(ctx, nextPath) {
  if (ctx.user) return true;
  redirect(ctx.res, `/login?next=${encodeURIComponent(nextPath)}`);
  return false;
}

function requireAdmin(ctx) {
  if (isAdmin(ctx.user)) return true;
  html(ctx.res, '<h1>403 — ruxsat yo‘q</h1><p><a href="/">Bosh sahifa</a></p>', 403);
  return false;
}

/** Rasmlarni diskka yozadi va bazaga qo'shadi. */
async function saveImages(files, listingId) {
  let sort = one('SELECT COALESCE(MAX(sort), -1) AS m FROM images WHERE listing_id = ?', listingId).m + 1;
  for (const file of files.slice(0, 10)) {
    const ext = IMAGE_TYPES[file.type];
    if (!ext || file.data.length > 10 * 1024 * 1024) continue;
    const name = `${randomUUID()}${ext}`;
    await writeFile(join(UPLOAD_DIR, name), file.data);
    insert('INSERT INTO images (listing_id, path, sort) VALUES (?, ?, ?)', listingId, name, sort++);
  }
}

/** Formadan e'lon maydonlarini yig'ib oladi (turga qarab). */
function listingFromForm(fields) {
  const type = ['product', 'property', 'car', 'service'].includes(fields.type) ? fields.type : 'product';
  const priceRaw = String(fields.price ?? '').trim();
  const category = fields.category_id ? one('SELECT * FROM categories WHERE id = ?', Number(fields.category_id)) : null;

  return {
    type,
    category_id: category?.id ?? null,
    title: String(fields.title || '').trim().slice(0, 120),
    description: String(fields.description || '').trim().slice(0, 4000),
    price: priceRaw === '' ? null : Math.max(0, Math.round(Number(priceRaw) || 0)),
    price_note: String(fields.price_note || '').trim().slice(0, 40) || null,
    condition: type === 'product' || type === 'car' ? String(fields.condition || 'Yangi') : null,
    deal: type === 'property' ? String(fields.deal || 'Sotuv') : null,
    stock: type === 'product' ? String(fields.stock || '').trim().slice(0, 60) : '',
    area: String(fields.area || '').trim().slice(0, 80),
    keywords: String(fields.keywords || '').trim().slice(0, 300),
    art_kind: String(fields.art_kind || 'phone'),
    status: fields.status === 'draft' ? 'draft' : 'pending',
  };
}

function saveAttrs(listingId, type, fields) {
  run('DELETE FROM listing_attrs WHERE listing_id = ?', listingId);
  let sort = 0;
  for (const field of S.TYPE_FIELDS[type] || []) {
    const value = String(fields[`attr_${field.key}`] || '').trim();
    if (!value) continue;
    insert(
      'INSERT INTO listing_attrs (listing_id, key, value, sort) VALUES (?, ?, ?, ?)',
      listingId, field.label, value.slice(0, 120), sort++
    );
  }
}

const attrsAsMap = (listingId, type) => {
  const rows = Q.listingAttrs(listingId);
  const byLabel = new Map(rows.map((r) => [r.key, r.value]));
  const out = {};
  for (const field of S.TYPE_FIELDS[type] || []) out[field.key] = byLabel.get(field.label) || '';
  return out;
};

/* ---------- statik fayllar ---------- */
async function serveStatic(pathname, res) {
  const name = basename(pathname);
  // Faqat kengaytmasi bor fayllar statik hisoblanadi (masalan /styles.css, /uploads/a.jpg)
  if (!name || !MIME[extname(name).toLowerCase()]) return false;

  const filePath = pathname.startsWith('/uploads/')
    ? join(UPLOAD_DIR, name)
    : join(ROOT, 'public', name);

  if (!existsSync(filePath)) return false;
  const data = await readFile(filePath);
  res.writeHead(200, {
    'content-type': MIME[extname(filePath).toLowerCase()] || 'application/octet-stream',
    'cache-control': pathname.startsWith('/uploads/') ? 'public, max-age=86400' : 'no-cache',
  });
  res.end(data);
  return true;
}

/* ---------- marshrutlar ---------- */
async function handle(ctx) {
  const { req, res, url, user } = ctx;
  const path = url.pathname;
  const method = req.method;
  const flash = flashFrom(url);
  const unread = Q.unreadCount(user?.id);

  /* ===== auth ===== */
  if (path === '/login') {
    if (method === 'GET') {
      return html(res, B.authPage({ mode: 'login', next: url.searchParams.get('next') || '' }));
    }
    const { fields } = await parseForm(req);
    const found = findUserByLogin(fields.login);
    if (!found || !verifyPassword(String(fields.password || ''), found.password_hash)) {
      return html(res, B.authPage({ mode: 'login', error: 'Login yoki parol xato', values: { login: fields.login } }), 401);
    }
    if (found.status !== 'active') {
      return html(res, B.authPage({ mode: 'login', error: 'Hisob bloklangan' }), 403);
    }
    const sid = createSession(found.id);
    audit({ actor: found, action: 'Kirish', target: `@${found.username}`, ip: clientIp(req) });
    return redirect(res, url.searchParams.get('next') || '/', { 'set-cookie': cookie(SESSION_COOKIE, sid) });
  }

  if (path === '/register') {
    if (method === 'GET') return html(res, B.authPage({ mode: 'register' }));
    const { fields } = await parseForm(req);
    const name = String(fields.name || '').trim();
    const username = String(fields.username || '').trim().toLowerCase();
    const email = String(fields.email || '').trim().toLowerCase();
    const password = String(fields.password || '');
    const role = fields.role === 'seller' ? 'seller' : 'buyer';

    if (name.length < 2 || !/^[a-z0-9_]{3,20}$/.test(username) || !email.includes('@') || password.length < 6) {
      return html(res, B.authPage({ mode: 'register', error: 'Maydonlarni to‘g‘ri to‘ldiring', values: fields }), 400);
    }
    if (one('SELECT 1 AS x FROM users WHERE email = ? OR username = ?', email, username)) {
      return html(res, B.authPage({ mode: 'register', error: 'Bu email yoki username band', values: fields }), 409);
    }
    const created = registerUser({ name, username, email, password, role });
    const sid = createSession(created.id);
    audit({ actor: created, action: 'Ro‘yxatdan o‘tish', target: `@${username}`, details: role, ip: clientIp(req) });
    return redirect(res, role === 'seller' ? '/seller/create-store' : '/', {
      'set-cookie': cookie(SESSION_COOKIE, sid),
    });
  }

  if (path === '/logout' && method === 'POST') {
    const sid = parseCookies(req)[SESSION_COOKIE];
    if (sid) destroySession(sid);
    return redirect(res, '/', { 'set-cookie': clearCookie(SESSION_COOKIE) });
  }

  /* ===== xaridor ===== */
  if (path === '/' && method === 'GET') {
    const cat = url.searchParams.get('cat') || '';
    const sub = url.searchParams.get('sub') || '';
    const listings = Q.findListings({ category: cat, sub });
    return html(res, B.feedPage({ user, cat, sub, listings, unread }));
  }

  if (path === '/explore' && method === 'GET') {
    const qText = url.searchParams.get('q') || '';
    const sort = url.searchParams.get('sort') || 'new';
    const listings = Q.findListings({ q: qText, sort });
    return html(res, B.explorePage({ user, qText, sort, listings, unread }));
  }

  if (path === '/saved' && method === 'GET') {
    if (!requireUser(ctx, '/saved')) return;
    return html(res, B.savedPage({ user, listings: Q.savedListings(user.id), unread }));
  }

  if (path === '/me' && method === 'GET') {
    if (!requireUser(ctx, '/me')) return;
    const store = storeOf(user);
    return html(res, B.mePage({ user, store, counts: Q.listingCounts(user.id), unread }));
  }

  const storeMatch = path.match(/^\/store\/([a-z0-9_-]+)$/i);
  if (storeMatch && method === 'GET') {
    const store = Q.storeBySlug(storeMatch[1]);
    if (!store) return notFound(res, 'Do‘kon topilmadi');
    const tab = url.searchParams.get('tab') === 'reviews' ? 'reviews' : 'listings';
    return html(res, B.storePage({
      user, store,
      stats: Q.storeStats(store.id),
      listings: Q.storeListings(store.id),
      reviews: Q.storeReviews(store.id),
      follow: Q.followRow(user?.id, store.id),
      tab, unread,
    }));
  }

  /* ===== e'lon ===== */
  const listingMatch = path.match(/^\/listing\/(\d+)(\/[a-z/]+(?:\/\d+\/delete)?)?$/i);
  if (listingMatch) {
    const id = Number(listingMatch[1]);
    const sub = listingMatch[2] || '';
    const listing = Q.listingById(id);
    if (!listing) return notFound(res, 'E‘lon topilmadi');
    const owns = user && (listing.owner_id === user.id || isAdmin(user));

    if (!sub && method === 'GET') {
      if (listing.status !== 'active' && !owns) return notFound(res, 'E‘lon mavjud emas');
      run('UPDATE listings SET views = views + 1 WHERE id = ?', id);
      const store = listing.store_id ? Q.storeById(listing.store_id) : null;
      return html(res, B.listingPage({
        user, listing,
        images: Q.listingImages(id),
        attrs: Q.listingAttrs(id),
        similar: Q.similarListings(listing),
        saved: Q.isSaved(user?.id, id),
        liked: Q.isLiked(user?.id, id),
        store,
        follow: store ? Q.followRow(user?.id, store.id) : null,
        reviews: store ? Q.storeReviews(store.id) : [],
        unread, flash,
      }));
    }

    if (sub === '/message' && method === 'POST') {
      if (!requireUser(ctx, `/listing/${id}`)) return;
      const { fields } = await parseForm(req);
      const body = String(fields.body || '').trim().slice(0, 1000);
      if (body && listing.owner_id !== user.id) {
        insert(
          'INSERT INTO messages (listing_id, from_user_id, to_user_id, body) VALUES (?, ?, ?, ?)',
          id, user.id, listing.owner_id, body
        );
      }
      return redirect(res, withMsg(`/listing/${id}`, 'ok', 'Xabar yuborildi'));
    }

    if (sub === '/edit') {
      if (!owns) return html(res, '<h1>403 — bu e‘lon sizga tegishli emas</h1>', 403);
      if (method === 'GET') {
        return html(res, S.listingForm({
          user, store: storeOf(user), type: listing.type, listing,
          attrs: attrsAsMap(id, listing.type),
          images: Q.listingImages(id),
          categories: Q.categories(),
        }));
      }
      const { fields, files } = await parseForm(req);
      const data = listingFromForm({ ...fields, type: listing.type });
      if (!data.title || !data.description || !data.category_id) {
        return html(res, S.listingForm({
          user, store: storeOf(user), type: listing.type, listing: { ...listing, ...data },
          attrs: attrsAsMap(id, listing.type), images: Q.listingImages(id),
          categories: Q.categories(), error: 'Nom, tavsif va kategoriya majburiy',
        }), 400);
      }
      run(
        `UPDATE listings SET category_id=?, title=?, description=?, price=?, price_note=?,
           condition=?, deal=?, stock=?, area=?, keywords=?, art_kind=?, status=?,
           reject_reason=NULL, updated_at=datetime('now')
         WHERE id = ?`,
        data.category_id, data.title, data.description, data.price, data.price_note,
        data.condition, data.deal, data.stock, data.area, data.keywords, data.art_kind,
        data.status, id
      );
      saveAttrs(id, listing.type, fields);
      await saveImages(files.filter((f) => f.field === 'images'), id);
      audit({ actor: user, action: 'E‘lon tahrirlandi', target: data.title, details: `#${id}`, ip: clientIp(req) });
      return redirect(res, withMsg('/seller/listings', 'ok', 'E‘lon saqlandi'));
    }

    if (sub === '/delete' && method === 'POST') {
      if (!owns) return html(res, '<h1>403</h1>', 403);
      run('DELETE FROM listings WHERE id = ?', id);
      audit({ actor: user, action: 'E‘lon o‘chirildi', target: listing.title, details: `#${id}`, ip: clientIp(req) });
      return redirect(res, withMsg('/seller/listings', 'ok', 'E‘lon o‘chirildi'));
    }

    const imgMatch = sub.match(/^\/image\/(\d+)\/delete$/);
    if (imgMatch) {
      if (!owns) return html(res, '<h1>403</h1>', 403);
      run('DELETE FROM images WHERE id = ? AND listing_id = ?', Number(imgMatch[1]), id);
      return redirect(res, `/listing/${id}/edit`);
    }
  }

  /* ===== e'lon joylash ===== */
  if (path === '/new') {
    if (!requireUser(ctx, '/new')) return;
    const store = storeOf(user);
    if (method === 'GET') {
      const type = ['product', 'property', 'car', 'service'].includes(url.searchParams.get('type'))
        ? url.searchParams.get('type')
        : 'product';
      return html(res, S.listingForm({ user, store, type, categories: Q.categories() }));
    }
    const { fields, files } = await parseForm(req);
    const data = listingFromForm(fields);
    if (!data.title || !data.description || !data.category_id) {
      return html(res, S.listingForm({
        user, store, type: data.type, listing: data, attrs: {}, categories: Q.categories(),
        error: 'Nom, tavsif va kategoriya majburiy',
      }), 400);
    }
    const id = insert(
      `INSERT INTO listings (owner_id, store_id, type, category_id, title, description, price, price_note,
         condition, deal, stock, area, keywords, art_kind, status)
       VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
      user.id, store?.id ?? null, data.type, data.category_id, data.title, data.description,
      data.price, data.price_note, data.condition, data.deal, data.stock, data.area,
      data.keywords, data.art_kind, data.status
    );
    saveAttrs(id, data.type, fields);
    await saveImages(files.filter((f) => f.field === 'images'), id);
    audit({ actor: user, action: 'E‘lon yaratildi', target: data.title, details: `#${id} · ${data.status}`, ip: clientIp(req) });
    return redirect(res, withMsg(store ? '/seller/listings' : '/me', 'ok',
      data.status === 'draft' ? 'Qoralama saqlandi' : 'E‘lon moderatsiyaga yuborildi'));
  }

  /* ===== xabarlar ===== */
  if (path === '/messages' && method === 'GET') {
    if (!requireUser(ctx, '/messages')) return;
    return html(res, B.threadsPage({ user, list: Q.threads(user.id), unread }));
  }

  const convMatch = path.match(/^\/messages\/(\d+)$/);
  if (convMatch) {
    if (!requireUser(ctx, path)) return;
    const peerId = Number(convMatch[1]);
    const peer = one('SELECT id, name, username FROM users WHERE id = ?', peerId);
    if (!peer) return notFound(res, 'Foydalanuvchi topilmadi');

    if (method === 'POST') {
      const { fields } = await parseForm(req);
      const body = String(fields.body || '').trim().slice(0, 1000);
      if (body) {
        insert('INSERT INTO messages (from_user_id, to_user_id, body) VALUES (?, ?, ?)', user.id, peerId, body);
      }
      return redirect(res, `/messages/${peerId}`);
    }
    run("UPDATE messages SET read_at = datetime('now') WHERE to_user_id = ? AND from_user_id = ? AND read_at IS NULL",
      user.id, peerId);
    return html(res, B.conversationPage({ user, peer, messages: Q.conversation(user.id, peerId), unread: Q.unreadCount(user.id) }));
  }

  /* ===== shikoyat ===== */
  const reportMatch = path.match(/^\/report\/(\d+)$/);
  if (reportMatch) {
    if (!requireUser(ctx, path)) return;
    const listing = Q.listingById(Number(reportMatch[1]));
    if (!listing) return notFound(res, 'E‘lon topilmadi');
    if (method === 'GET') return html(res, B.reportPage({ user, listing, unread }));
    const { fields } = await parseForm(req);
    insert('INSERT INTO reports (listing_id, from_user_id, reason) VALUES (?, ?, ?)',
      listing.id, user.id, String(fields.reason || 'Boshqa').slice(0, 120));
    return redirect(res, withMsg(`/listing/${listing.id}`, 'ok', 'Shikoyat yuborildi'));
  }

  /* ===== API (like / save / follow / notify) ===== */
  const apiMatch = path.match(/^\/api\/(like|save|follow|notify)\/(\d+)$/);
  if (apiMatch && method === 'POST') {
    if (!user) return json(res, { error: 'auth' }, 401);
    const [, action, rawId] = apiMatch;
    const id = Number(rawId);

    if (action === 'like' || action === 'save') {
      const table = action === 'like' ? 'likes' : 'saves';
      const exists = one(`SELECT 1 AS x FROM ${table} WHERE user_id = ? AND listing_id = ?`, user.id, id);
      if (exists) run(`DELETE FROM ${table} WHERE user_id = ? AND listing_id = ?`, user.id, id);
      else run(`INSERT INTO ${table} (user_id, listing_id) VALUES (?, ?)`, user.id, id);
      const count = one(`SELECT COUNT(*) AS n FROM ${table} WHERE listing_id = ?`, id).n;
      return json(res, {
        on: !exists,
        count,
        message: action === 'save' ? (exists ? 'Saqlanganlardan olib tashlandi' : 'Saqlandi') : null,
      });
    }

    const store = Q.storeById(id);
    if (!store) return json(res, { error: 'not_found' }, 404);
    const row = Q.followRow(user.id, id);

    if (action === 'follow') {
      if (row) run('DELETE FROM follows WHERE user_id = ? AND store_id = ?', user.id, id);
      else run('INSERT INTO follows (user_id, store_id, notify) VALUES (?, ?, 0)', user.id, id);
      return json(res, { on: !row, message: row ? 'Kuzatish bekor qilindi' : 'Kuzatilyapti' });
    }

    // notify: qo'ng'iroqcha — kuzatishdan alohida
    if (!row) {
      run('INSERT INTO follows (user_id, store_id, notify) VALUES (?, ?, 1)', user.id, id);
      return json(res, { on: true, message: 'Yangi e‘lon bildirishnomasi yoqildi' });
    }
    const next = row.notify ? 0 : 1;
    run('UPDATE follows SET notify = ? WHERE user_id = ? AND store_id = ?', next, user.id, id);
    return json(res, { on: !!next, message: next ? 'Bildirishnoma yoqildi' : 'Bildirishnoma o‘chirildi' });
  }

  /* ===== sotuvchi kabineti ===== */
  if (path === '/seller/create-store') {
    if (!requireUser(ctx, path)) return;
    if (storeOf(user)) return redirect(res, '/seller');
    if (method === 'GET') return html(res, S.createStorePage({ user }));
    const { fields } = await parseForm(req);
    const slug = String(fields.slug || '').trim().toLowerCase();
    const title = String(fields.title || '').trim();
    if (!/^[a-z0-9_-]{3,30}$/.test(slug) || title.length < 2) {
      return html(res, S.createStorePage({ user, error: 'Nom va manzilni to‘g‘ri kiriting' }), 400);
    }
    if (Q.storeBySlug(slug)) {
      return html(res, S.createStorePage({ user, error: 'Bu manzil band' }), 409);
    }
    const id = insert(
      `INSERT INTO stores (owner_id, slug, title, bio, area, category, status)
       VALUES (?, ?, ?, ?, ?, ?, 'pending')`,
      user.id, slug, title,
      String(fields.bio || '').slice(0, 500),
      String(fields.area || '').slice(0, 80),
      String(fields.category || '').slice(0, 60)
    );
    if (user.role === 'buyer') run("UPDATE users SET role = 'seller' WHERE id = ?", user.id);
    audit({ actor: user, action: 'Do‘kon yaratildi', target: title, details: `#${id}`, ip: clientIp(req) });
    return redirect(res, withMsg('/seller', 'ok', 'Do‘kon yaratildi — tasdiqlanishini kuting'));
  }

  if (path.startsWith('/seller')) {
    if (!requireUser(ctx, path)) return;
    const store = storeOf(user);
    if (!store) return redirect(res, '/seller/create-store');
    const counts = Q.listingCounts(user.id);

    if (path === '/seller') {
      const views = Q.myListings(user.id).reduce((sum, l) => sum + l.views, 0);
      const unreadLeads = Q.unreadCount(user.id);
      return html(res, S.sellerDashboard({
        user, store, counts, listings: Q.myListings(user.id), unreadLeads, views, flash,
      }));
    }
    if (path === '/seller/listings') {
      const status = url.searchParams.get('status') || '';
      return html(res, S.sellerListings({
        user, store, counts, status, listings: Q.myListings(user.id, status), flash,
      }));
    }
    if (path === '/seller/messages') {
      return html(res, S.sellerMessages({ user, store, list: Q.threads(user.id) }));
    }
  }

  /* ===== admin ===== */
  if (path.startsWith('/admin')) {
    if (!requireUser(ctx, path)) return;
    if (!requireAdmin(ctx)) return;
    const stats = Q.adminStats();

    if (path === '/admin' && method === 'GET') {
      return html(res, A.adminDashboard({ user, stats, recent: Q.auditLog(8), flash }));
    }
    if (path === '/admin/moderation' && method === 'GET') {
      return html(res, A.adminModeration({ user, queue: Q.moderationQueue(), stats, flash }));
    }
    if (path === '/admin/listings' && method === 'GET') {
      const status = url.searchParams.get('status') || '';
      const where = status ? 'WHERE l.status = ?' : '';
      const listings = all(
        `SELECT l.*, s.title AS store_title, u.name AS owner_name, c.name AS category_name,
                (SELECT path FROM images WHERE listing_id = l.id ORDER BY sort LIMIT 1) AS cover
           FROM listings l
           LEFT JOIN stores s ON s.id = l.store_id
           LEFT JOIN users u ON u.id = l.owner_id
           LEFT JOIN categories c ON c.id = l.category_id
           ${where} ORDER BY l.created_at DESC LIMIT 200`,
        ...(status ? [status] : [])
      );
      return html(res, A.adminListings({ user, listings, stats, status, flash }));
    }
    if (path === '/admin/stores' && method === 'GET') {
      return html(res, A.adminStores({ user, stores: Q.allStores(), stats, flash }));
    }
    if (path === '/admin/users' && method === 'GET') {
      return html(res, A.adminUsers({ user, users: Q.allUsers(), stats, flash }));
    }
    if (path === '/admin/reports' && method === 'GET') {
      return html(res, A.adminReports({ user, reports: Q.openReports(), stats, flash }));
    }
    if (path === '/admin/audit' && method === 'GET') {
      return html(res, A.adminAudit({ user, logs: Q.auditLog(150), stats }));
    }

    if (path === '/admin/categories' && method === 'GET') {
      const categories = all(
        `SELECT c.*, (SELECT COUNT(*) FROM listings WHERE category_id = c.id) AS listings
           FROM categories c ORDER BY c.sort, c.id`
      );
      const subs = {};
      for (const c of categories) subs[c.id] = Q.subcategories(c.id);
      const editId = Number(url.searchParams.get('edit') || 0);
      const editing = editId ? categories.find((c) => c.id === editId) || null : null;
      return html(res, A.adminCategories({ user, categories, subs, stats, editing, flash }));
    }

    if (path === '/admin/categories' && method === 'POST') {
      const { fields } = await parseForm(req);
      const name = String(fields.name || '').trim().slice(0, 40);
      if (!name) return redirect(res, withMsg('/admin/categories', 'err', 'Nom kiriting'));
      if (one('SELECT 1 AS x FROM categories WHERE name = ?', name)) {
        return redirect(res, withMsg('/admin/categories', 'err', 'Bu kategoriya bor'));
      }
      const maxSort = one('SELECT COALESCE(MAX(sort), 0) AS m FROM categories').m;
      const id = insert(
        'INSERT INTO categories (name, art_kind, art_bg, sort) VALUES (?, ?, ?, ?)',
        name, String(fields.art_kind || 'all'), String(fields.art_bg || '#eef2f1'), maxSort + 1
      );
      syncSubs(id, fields.subs);
      audit({ actor: user, action: 'Kategoriya qo‘shildi', target: name, ip: clientIp(req) });
      return redirect(res, withMsg('/admin/categories', 'ok', `«${name}» qo‘shildi`));
    }

    const catEdit = path.match(/^\/admin\/categories\/(\d+)$/);
    if (catEdit && method === 'POST') {
      const id = Number(catEdit[1]);
      const before = one('SELECT * FROM categories WHERE id = ?', id);
      if (!before) return notFound(res, 'Kategoriya topilmadi');
      const { fields } = await parseForm(req);
      const name = String(fields.name || '').trim().slice(0, 40);
      if (!name) return redirect(res, withMsg('/admin/categories', 'err', 'Nom kiriting'));
      run('UPDATE categories SET name = ?, art_kind = ?, art_bg = ? WHERE id = ?',
        name, String(fields.art_kind || 'all'), String(fields.art_bg || '#eef2f1'), id);
      syncSubs(id, fields.subs);
      audit({
        actor: user, action: 'Kategoriya tahrirlandi', target: name,
        details: before.name !== name ? `${before.name} → ${name}` : 'atributlar', ip: clientIp(req),
      });
      return redirect(res, withMsg('/admin/categories', 'ok', 'Saqlandi'));
    }

    const catDel = path.match(/^\/admin\/categories\/(\d+)\/delete$/);
    if (catDel && method === 'POST') {
      const cat = one('SELECT * FROM categories WHERE id = ?', Number(catDel[1]));
      if (cat) {
        run('DELETE FROM categories WHERE id = ?', cat.id);
        audit({ actor: user, action: 'Kategoriya o‘chirildi', target: cat.name, ip: clientIp(req) });
      }
      return redirect(res, withMsg('/admin/categories', 'ok', 'O‘chirildi'));
    }

    const modAction = path.match(/^\/admin\/listing\/(\d+)\/(approve|reject|hide)$/);
    if (modAction && method === 'POST') {
      const id = Number(modAction[1]);
      const action = modAction[2];
      const listing = one('SELECT * FROM listings WHERE id = ?', id);
      if (!listing) return notFound(res, 'E‘lon topilmadi');

      if (action === 'approve') {
        run("UPDATE listings SET status = 'active', reject_reason = NULL WHERE id = ?", id);
        audit({ actor: user, action: 'E‘lon tasdiqlandi', target: listing.title, details: `#${id}`, ip: clientIp(req) });
      } else if (action === 'reject') {
        const { fields } = await parseForm(req);
        const reason = String(fields.reason || 'Qoidalarga mos emas').slice(0, 200);
        run("UPDATE listings SET status = 'rejected', reject_reason = ? WHERE id = ?", reason, id);
        audit({ actor: user, action: 'E‘lon rad etildi', target: listing.title, details: reason, ip: clientIp(req) });
      } else {
        run("UPDATE listings SET status = 'hidden' WHERE id = ?", id);
        audit({ actor: user, action: 'E‘lon yashirildi', target: listing.title, details: `#${id}`, ip: clientIp(req) });
      }
      return redirect(res, withMsg(req.headers.referer?.includes('/admin/listings') ? '/admin/listings' : '/admin/moderation', 'ok', 'Bajarildi'));
    }

    const storeAction = path.match(/^\/admin\/store\/(\d+)\/(verify|block)$/);
    if (storeAction && method === 'POST') {
      const id = Number(storeAction[1]);
      const store = Q.storeById(id);
      if (!store) return notFound(res, 'Do‘kon topilmadi');
      if (storeAction[2] === 'verify') {
        run("UPDATE stores SET status = 'active', verified = 1 WHERE id = ?", id);
        audit({ actor: user, action: 'Do‘kon tasdiqlandi', target: store.title, ip: clientIp(req) });
      } else {
        run("UPDATE stores SET status = 'blocked' WHERE id = ?", id);
        audit({ actor: user, action: 'Do‘kon bloklandi', target: store.title, ip: clientIp(req) });
      }
      return redirect(res, withMsg('/admin/stores', 'ok', 'Bajarildi'));
    }

    const userToggle = path.match(/^\/admin\/user\/(\d+)\/toggle$/);
    if (userToggle && method === 'POST') {
      const id = Number(userToggle[1]);
      const target = one('SELECT * FROM users WHERE id = ?', id);
      if (!target || target.id === user.id) return redirect(res, '/admin/users');
      const next = target.status === 'active' ? 'blocked' : 'active';
      run('UPDATE users SET status = ? WHERE id = ?', next, id);
      if (next === 'blocked') run('DELETE FROM sessions WHERE user_id = ?', id);
      audit({
        actor: user, action: next === 'blocked' ? 'Foydalanuvchi bloklandi' : 'Blok ochildi',
        target: `@${target.username}`, ip: clientIp(req),
      });
      return redirect(res, withMsg('/admin/users', 'ok', 'Bajarildi'));
    }

    const reportClose = path.match(/^\/admin\/report\/(\d+)\/close$/);
    if (reportClose && method === 'POST') {
      run("UPDATE reports SET status = 'closed' WHERE id = ?", Number(reportClose[1]));
      audit({ actor: user, action: 'Shikoyat yopildi', target: `#${reportClose[1]}`, ip: clientIp(req) });
      return redirect(res, withMsg('/admin/reports', 'ok', 'Yopildi'));
    }
  }

  return notFound(res, `<h1>404</h1><p>Sahifa topilmadi.</p><p><a href="/">Bosh sahifa</a></p>`);
}

function syncSubs(categoryId, raw) {
  const names = String(raw || '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, 20);
  run('DELETE FROM subcategories WHERE category_id = ?', categoryId);
  for (const name of names) {
    insert('INSERT OR IGNORE INTO subcategories (category_id, name) VALUES (?, ?)', categoryId, name.slice(0, 40));
  }
}

/* ---------- server ---------- */
const server = createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  try {
    if (req.method === 'GET' && (await serveStatic(url.pathname, res))) return;
    const user = userFromSession(parseCookies(req)[SESSION_COOKIE]);
    await handle({ req, res, url, user });
  } catch (err) {
    console.error('Xatolik:', err);
    if (!res.headersSent) {
      html(res, `<h1>500 — server xatosi</h1><p>${esc(err.message)}</p><p><a href="/">Bosh sahifa</a></p>`, 500);
    }
  }
});

server.listen(PORT, () => {
  console.log(`RASTA ishga tushdi → http://localhost:${PORT}`);
});
