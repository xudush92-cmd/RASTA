-- RASTA ma'lumotlar sxemasi
-- Muhim: ilovada to'lov tizimi yo'q. Katalog, discovery va aloqa.

PRAGMA journal_mode = WAL;
PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS users (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  name          TEXT    NOT NULL,
  username      TEXT    NOT NULL UNIQUE,
  email         TEXT    NOT NULL UNIQUE,
  password_hash TEXT    NOT NULL,
  role          TEXT    NOT NULL DEFAULT 'buyer' CHECK (role IN ('buyer','seller','admin')),
  status        TEXT    NOT NULL DEFAULT 'active' CHECK (status IN ('active','blocked')),
  created_at    TEXT    NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS stores (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  owner_id   INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  slug       TEXT    NOT NULL UNIQUE,
  title      TEXT    NOT NULL,
  bio        TEXT    NOT NULL DEFAULT '',
  area       TEXT    NOT NULL DEFAULT '',
  category   TEXT    NOT NULL DEFAULT '',
  color      TEXT    NOT NULL DEFAULT '#0c9b88',
  verified   INTEGER NOT NULL DEFAULT 0,
  status     TEXT    NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','active','blocked')),
  created_at TEXT    NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_stores_owner ON stores(owner_id);

CREATE TABLE IF NOT EXISTS categories (
  id       INTEGER PRIMARY KEY AUTOINCREMENT,
  name     TEXT    NOT NULL UNIQUE,
  art_kind TEXT    NOT NULL DEFAULT 'all',
  art_bg   TEXT    NOT NULL DEFAULT '#eef2f1',
  art_color TEXT   NOT NULL DEFAULT '#0c9b88',
  sort     INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS subcategories (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  category_id INTEGER NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  name        TEXT    NOT NULL,
  UNIQUE (category_id, name)
);

-- Universal e'lon: mahsulot, ko'chmas mulk, avto yoki xizmat
CREATE TABLE IF NOT EXISTS listings (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  owner_id      INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  store_id      INTEGER REFERENCES stores(id) ON DELETE SET NULL,
  type          TEXT    NOT NULL DEFAULT 'product' CHECK (type IN ('product','property','car','service')),
  category_id   INTEGER REFERENCES categories(id) ON DELETE SET NULL,
  subcategory   TEXT,
  title         TEXT    NOT NULL,
  description   TEXT    NOT NULL DEFAULT '',
  price         INTEGER,               -- NULL = kelishiladi
  price_note    TEXT,                  -- 'Kelishiladi', 'oyiga', 'soatbay'
  condition     TEXT,                  -- faqat product/car: Yangi | Ishlatilgan
  deal          TEXT,                  -- faqat property: Sotuv | Ijara
  stock         TEXT    NOT NULL DEFAULT '',
  area          TEXT    NOT NULL DEFAULT '',
  keywords      TEXT    NOT NULL DEFAULT '',
  art_kind      TEXT    NOT NULL DEFAULT 'phone',
  art_color     TEXT    NOT NULL DEFAULT '#26384a',
  art_bg        TEXT    NOT NULL DEFAULT '#e7f1f2',
  status        TEXT    NOT NULL DEFAULT 'pending'
                CHECK (status IN ('draft','pending','active','rejected','hidden')),
  reject_reason TEXT,
  views         INTEGER NOT NULL DEFAULT 0,
  created_at    TEXT    NOT NULL DEFAULT (datetime('now')),
  updated_at    TEXT    NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_listings_status   ON listings(status);
CREATE INDEX IF NOT EXISTS idx_listings_category ON listings(category_id);
CREATE INDEX IF NOT EXISTS idx_listings_store    ON listings(store_id);
CREATE INDEX IF NOT EXISTS idx_listings_owner    ON listings(owner_id);

-- Turga mos dinamik atributlar: xonalar, m2, yil, probeg, doza...
CREATE TABLE IF NOT EXISTS listing_attrs (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  listing_id INTEGER NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
  key        TEXT    NOT NULL,
  value      TEXT    NOT NULL,
  sort       INTEGER NOT NULL DEFAULT 0
);
CREATE INDEX IF NOT EXISTS idx_attrs_listing ON listing_attrs(listing_id);

CREATE TABLE IF NOT EXISTS images (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  listing_id INTEGER NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
  path       TEXT    NOT NULL,
  sort       INTEGER NOT NULL DEFAULT 0,
  created_at TEXT    NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_images_listing ON images(listing_id);

-- Kuzatish (feed uchun) va bildirishnoma (qo'ng'iroqcha) alohida
CREATE TABLE IF NOT EXISTS follows (
  user_id  INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  store_id INTEGER NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
  notify   INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (user_id, store_id)
);

CREATE TABLE IF NOT EXISTS saves (
  user_id    INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  listing_id INTEGER NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
  created_at TEXT    NOT NULL DEFAULT (datetime('now')),
  PRIMARY KEY (user_id, listing_id)
);

CREATE TABLE IF NOT EXISTS likes (
  user_id    INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  listing_id INTEGER NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
  PRIMARY KEY (user_id, listing_id)
);

-- Murojaat: xaridor va sotuvchi o'rtasidagi aloqa (buyurtma emas)
CREATE TABLE IF NOT EXISTS messages (
  id           INTEGER PRIMARY KEY AUTOINCREMENT,
  listing_id   INTEGER REFERENCES listings(id) ON DELETE SET NULL,
  from_user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  to_user_id   INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  body         TEXT    NOT NULL,
  read_at      TEXT,
  created_at   TEXT    NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_messages_to   ON messages(to_user_id);
CREATE INDEX IF NOT EXISTS idx_messages_from ON messages(from_user_id);

CREATE TABLE IF NOT EXISTS reviews (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  store_id   INTEGER NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
  user_id    INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  rating     INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  text       TEXT    NOT NULL DEFAULT '',
  created_at TEXT    NOT NULL DEFAULT (datetime('now')),
  UNIQUE (store_id, user_id)
);

CREATE TABLE IF NOT EXISTS reports (
  id           INTEGER PRIMARY KEY AUTOINCREMENT,
  listing_id   INTEGER REFERENCES listings(id) ON DELETE CASCADE,
  from_user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
  reason       TEXT    NOT NULL,
  status       TEXT    NOT NULL DEFAULT 'new' CHECK (status IN ('new','reviewed','closed')),
  created_at   TEXT    NOT NULL DEFAULT (datetime('now'))
);

-- Audit: kim, qachon, nima (o'zgartirilmaydigan yozuv)
CREATE TABLE IF NOT EXISTS audit_log (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  actor_id   INTEGER REFERENCES users(id) ON DELETE SET NULL,
  actor_name TEXT    NOT NULL DEFAULT '',
  actor_role TEXT    NOT NULL DEFAULT '',
  action     TEXT    NOT NULL,
  target     TEXT    NOT NULL DEFAULT '',
  details    TEXT    NOT NULL DEFAULT '',
  ip         TEXT    NOT NULL DEFAULT '',
  created_at TEXT    NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_audit_created ON audit_log(created_at DESC);

CREATE TABLE IF NOT EXISTS sessions (
  id         TEXT    PRIMARY KEY,
  user_id    INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TEXT    NOT NULL DEFAULT (datetime('now')),
  expires_at TEXT    NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_sessions_user ON sessions(user_id);

CREATE TABLE IF NOT EXISTS settings (
  key   TEXT PRIMARY KEY,
  value TEXT NOT NULL
);
