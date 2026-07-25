import { DatabaseSync } from 'node:sqlite';
import { readFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
export const ROOT = join(here, '..');
export const DATA_DIR = process.env.RASTA_DATA_DIR || join(ROOT, 'data');
export const UPLOAD_DIR = join(DATA_DIR, 'uploads');
const DB_PATH = join(DATA_DIR, 'rasta.db');

mkdirSync(UPLOAD_DIR, { recursive: true });

export const db = new DatabaseSync(DB_PATH);
db.exec(readFileSync(join(here, 'schema.sql'), 'utf8'));

/** Bitta qator qaytaradi yoki undefined. */
export const one = (sql, ...params) => db.prepare(sql).get(...params);

/** Qatorlar massivini qaytaradi. */
export const all = (sql, ...params) => db.prepare(sql).all(...params);

/** INSERT/UPDATE/DELETE bajaradi, natija ma'lumotini qaytaradi. */
export const run = (sql, ...params) => db.prepare(sql).run(...params);

/** INSERT qilib, yangi yozuv id'sini qaytaradi. */
export const insert = (sql, ...params) => Number(run(sql, ...params).lastInsertRowid);

/** Bir nechta amalni bitta tranzaksiyada bajaradi. */
export function tx(fn) {
  db.exec('BEGIN');
  try {
    const result = fn();
    db.exec('COMMIT');
    return result;
  } catch (err) {
    db.exec('ROLLBACK');
    throw err;
  }
}

/**
 * Audit yozuvi: kim, qachon, nima. Yozuvlar o'zgartirilmaydi va o'chirilmaydi.
 */
export function audit({ actor, action, target = '', details = '', ip = '' }) {
  insert(
    `INSERT INTO audit_log (actor_id, actor_name, actor_role, action, target, details, ip)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    actor?.id ?? null,
    actor?.name ?? 'tizim',
    actor?.role ?? 'system',
    action,
    target,
    details,
    ip
  );
}

export function getSetting(key, fallback = null) {
  return one('SELECT value FROM settings WHERE key = ?', key)?.value ?? fallback;
}

export function setSetting(key, value) {
  run(
    `INSERT INTO settings (key, value) VALUES (?, ?)
     ON CONFLICT(key) DO UPDATE SET value = excluded.value`,
    key,
    String(value)
  );
}
