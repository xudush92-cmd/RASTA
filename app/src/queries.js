import { all, one } from './db.js';

export const categories = () => all('SELECT * FROM categories ORDER BY sort, id');

export const categoryByName = (name) => one('SELECT * FROM categories WHERE name = ?', name);

export const subcategories = (categoryId) =>
  all('SELECT name FROM subcategories WHERE category_id = ? ORDER BY id', categoryId).map((r) => r.name);

const LISTING_SELECT = `
  SELECT l.*, s.title AS store_title, s.slug AS store_slug, s.color AS store_color,
         s.verified AS store_verified, u.name AS owner_name, u.username AS owner_username,
         c.name AS category_name,
         (SELECT path FROM images WHERE listing_id = l.id ORDER BY sort, id LIMIT 1) AS cover,
         (SELECT COUNT(*) FROM likes WHERE listing_id = l.id) AS likes
    FROM listings l
    LEFT JOIN stores s     ON s.id = l.store_id
    LEFT JOIN users u      ON u.id = l.owner_id
    LEFT JOIN categories c ON c.id = l.category_id`;

/**
 * Public e'lonlar ro'yxati. Faqat 'active' holatdagilar ko'rinadi.
 * Qidiruv sarlavha, tavsif, kalit so'z, do'kon nomi va kategoriya bo'yicha ishlaydi.
 */
export function findListings({ category = '', sub = '', q = '', storeId = null, limit = 60, sort = 'new' } = {}) {
  const where = ["l.status = 'active'"];
  const params = [];

  if (category && category !== 'Barchasi') {
    where.push('c.name = ?');
    params.push(category);
  }
  if (sub) {
    where.push('(l.subcategory = ? OR l.deal = ?)');
    params.push(sub, sub);
  }
  if (storeId) {
    where.push('l.store_id = ?');
    params.push(storeId);
  }
  if (q) {
    const like = `%${q.toLowerCase()}%`;
    where.push(`(lower(l.title) LIKE ? OR lower(l.description) LIKE ? OR lower(l.keywords) LIKE ?
                 OR lower(COALESCE(s.title,'')) LIKE ? OR lower(COALESCE(c.name,'')) LIKE ?)`);
    params.push(like, like, like, like, like);
  }

  const order =
    sort === 'cheap' ? 'l.price IS NULL, l.price ASC' :
    sort === 'expensive' ? 'l.price DESC' :
    'l.created_at DESC';

  return all(`${LISTING_SELECT} WHERE ${where.join(' AND ')} ORDER BY ${order} LIMIT ?`, ...params, limit);
}

export const listingById = (id) => one(`${LISTING_SELECT} WHERE l.id = ?`, id);

export const listingImages = (id) =>
  all('SELECT * FROM images WHERE listing_id = ? ORDER BY sort, id', id);

export const listingAttrs = (id) =>
  all('SELECT key, value FROM listing_attrs WHERE listing_id = ? ORDER BY sort, id', id);

/** O'xshash e'lonlar: avval bir xil kategoriya, keyin qolganlari. */
export function similarListings(listing, limit = 6) {
  return all(
    `${LISTING_SELECT}
      WHERE l.status = 'active' AND l.id <> ?
      ORDER BY (l.category_id = ?) DESC, l.created_at DESC
      LIMIT ?`,
    listing.id,
    listing.category_id,
    limit
  );
}

export const storeListings = (storeId, limit = 30) =>
  findListings({ storeId, limit });

export const storeBySlug = (slug) => one('SELECT * FROM stores WHERE slug = ?', slug);

export const storeById = (id) => one('SELECT * FROM stores WHERE id = ?', id);

export function storeStats(storeId) {
  const listings = one(
    "SELECT COUNT(*) AS n FROM listings WHERE store_id = ? AND status = 'active'",
    storeId
  ).n;
  const followers = one('SELECT COUNT(*) AS n FROM follows WHERE store_id = ?', storeId).n;
  const rating = one(
    'SELECT ROUND(AVG(rating), 1) AS r, COUNT(*) AS n FROM reviews WHERE store_id = ?',
    storeId
  );
  return { listings, followers, rating: rating.r, reviews: rating.n };
}

export const storeReviews = (storeId) =>
  all(
    `SELECT r.*, u.name AS user_name FROM reviews r
       JOIN users u ON u.id = r.user_id
      WHERE r.store_id = ? ORDER BY r.created_at DESC`,
    storeId
  );

export const savedListings = (userId) =>
  all(
    `${LISTING_SELECT}
       JOIN saves sv ON sv.listing_id = l.id
      WHERE sv.user_id = ? AND l.status = 'active'
      ORDER BY sv.created_at DESC`,
    userId
  );

export const isSaved = (userId, listingId) =>
  !!(userId && one('SELECT 1 AS x FROM saves WHERE user_id = ? AND listing_id = ?', userId, listingId));

export const isLiked = (userId, listingId) =>
  !!(userId && one('SELECT 1 AS x FROM likes WHERE user_id = ? AND listing_id = ?', userId, listingId));

export const followRow = (userId, storeId) =>
  userId ? one('SELECT * FROM follows WHERE user_id = ? AND store_id = ?', userId, storeId) : null;

export const unreadCount = (userId) =>
  userId
    ? one('SELECT COUNT(*) AS n FROM messages WHERE to_user_id = ? AND read_at IS NULL', userId).n
    : 0;

/** Suhbatlar ro'yxati: har bir hamkor bilan oxirgi xabar. */
export const threads = (userId) =>
  all(
    `WITH peers AS (
       SELECT CASE WHEN from_user_id = ? THEN to_user_id ELSE from_user_id END AS peer_id,
              MAX(id) AS last_id
         FROM messages
        WHERE from_user_id = ? OR to_user_id = ?
        GROUP BY peer_id
     )
     SELECT m.*, p.peer_id, u.name AS peer_name, u.username AS peer_username,
            (SELECT COUNT(*) FROM messages
              WHERE to_user_id = ? AND from_user_id = p.peer_id AND read_at IS NULL) AS unread
       FROM peers p
       JOIN messages m ON m.id = p.last_id
       JOIN users u    ON u.id = p.peer_id
      ORDER BY m.created_at DESC`,
    userId, userId, userId, userId
  );

export const conversation = (userId, peerId) =>
  all(
    `SELECT m.*, u.name AS from_name FROM messages m
       JOIN users u ON u.id = m.from_user_id
      WHERE (m.from_user_id = ? AND m.to_user_id = ?)
         OR (m.from_user_id = ? AND m.to_user_id = ?)
      ORDER BY m.created_at`,
    userId, peerId, peerId, userId
  );

/** Sotuvchining barcha e'lonlari (har qanday holatda). */
export const myListings = (userId, status = '') => {
  const where = ['l.owner_id = ?'];
  const params = [userId];
  if (status) {
    where.push('l.status = ?');
    params.push(status);
  }
  return all(`${LISTING_SELECT} WHERE ${where.join(' AND ')} ORDER BY l.updated_at DESC`, ...params);
};

export const listingCounts = (userId) => {
  const rows = all(
    'SELECT status, COUNT(*) AS n FROM listings WHERE owner_id = ? GROUP BY status',
    userId
  );
  const out = { all: 0, active: 0, pending: 0, draft: 0, rejected: 0, hidden: 0 };
  for (const row of rows) {
    out[row.status] = row.n;
    out.all += row.n;
  }
  return out;
};

/* ---------- admin ---------- */
export const moderationQueue = () =>
  all(`${LISTING_SELECT} WHERE l.status = 'pending' ORDER BY l.created_at`);

export const adminStats = () => ({
  users: one('SELECT COUNT(*) AS n FROM users').n,
  stores: one('SELECT COUNT(*) AS n FROM stores').n,
  listings: one("SELECT COUNT(*) AS n FROM listings WHERE status = 'active'").n,
  pending: one("SELECT COUNT(*) AS n FROM listings WHERE status = 'pending'").n,
  reports: one("SELECT COUNT(*) AS n FROM reports WHERE status = 'new'").n,
  messages: one('SELECT COUNT(*) AS n FROM messages').n,
});

export const allUsers = () => all('SELECT * FROM users ORDER BY created_at DESC LIMIT 200');

export const allStores = () =>
  all(
    `SELECT s.*, u.name AS owner_name,
            (SELECT COUNT(*) FROM listings WHERE store_id = s.id AND status='active') AS listings,
            (SELECT COUNT(*) FROM follows WHERE store_id = s.id) AS followers
       FROM stores s JOIN users u ON u.id = s.owner_id
      ORDER BY s.created_at DESC`
  );

export const auditLog = (limit = 100) =>
  all('SELECT * FROM audit_log ORDER BY id DESC LIMIT ?', limit);

export const openReports = () =>
  all(
    `SELECT r.*, l.title AS listing_title, u.username AS reporter
       FROM reports r
       LEFT JOIN listings l ON l.id = r.listing_id
       LEFT JOIN users u    ON u.id = r.from_user_id
      ORDER BY r.created_at DESC LIMIT 100`
  );
