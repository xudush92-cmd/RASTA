import { randomBytes, scryptSync, timingSafeEqual, randomUUID } from 'node:crypto';
import { one, run, insert } from './db.js';

const SESSION_DAYS = 30;
export const SESSION_COOKIE = 'rasta_sid';

/** Parolni scrypt bilan xeshlaydi (tuz + xesh birga saqlanadi). */
export function hashPassword(password) {
  const salt = randomBytes(16).toString('hex');
  const hash = scryptSync(password, salt, 64).toString('hex');
  return `scrypt:${salt}:${hash}`;
}

export function verifyPassword(password, stored) {
  const [scheme, salt, hash] = String(stored).split(':');
  if (scheme !== 'scrypt' || !salt || !hash) return false;
  const expected = Buffer.from(hash, 'hex');
  const actual = scryptSync(password, salt, expected.length);
  return actual.length === expected.length && timingSafeEqual(actual, expected);
}

export function createSession(userId) {
  const id = randomUUID();
  const expires = new Date(Date.now() + SESSION_DAYS * 864e5).toISOString();
  insert('INSERT INTO sessions (id, user_id, expires_at) VALUES (?, ?, ?)', id, userId, expires);
  return id;
}

export const destroySession = (id) => run('DELETE FROM sessions WHERE id = ?', id);

/** Sessiya cookie'si bo'yicha foydalanuvchini qaytaradi (bloklangan bo'lsa — null). */
export function userFromSession(sid) {
  if (!sid) return null;
  const row = one(
    `SELECT u.* FROM sessions s
       JOIN users u ON u.id = s.user_id
      WHERE s.id = ? AND s.expires_at > datetime('now') AND u.status = 'active'`,
    sid
  );
  return row || null;
}

export function registerUser({ name, username, email, password, role = 'buyer' }) {
  const id = insert(
    `INSERT INTO users (name, username, email, password_hash, role)
     VALUES (?, ?, ?, ?, ?)`,
    name,
    username.toLowerCase(),
    email.toLowerCase(),
    hashPassword(password),
    role
  );
  return one('SELECT * FROM users WHERE id = ?', id);
}

export function findUserByLogin(login) {
  const value = String(login || '').toLowerCase().trim();
  return one('SELECT * FROM users WHERE email = ? OR username = ?', value, value) || null;
}

export const isSeller = (user) => user?.role === 'seller' || user?.role === 'admin';
export const isAdmin = (user) => user?.role === 'admin';

/** Foydalanuvchining do'koni (sotuvchi bo'lsa). */
export const storeOf = (user) =>
  user ? one('SELECT * FROM stores WHERE owner_id = ?', user.id) || null : null;
