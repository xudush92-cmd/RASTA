/**
 * Namuna ma'lumotlar. Ishga tushirish:
 *   npm run seed          — bo'sh bazaga to'ldiradi
 *   npm run reset         — hammasini o'chirib qayta to'ldiradi
 */
import { db, one, run, insert, audit } from './db.js';
import { hashPassword } from './auth.js';

const RESET = process.argv.includes('--reset');

if (RESET) {
  for (const table of [
    'audit_log', 'sessions', 'reports', 'reviews', 'messages', 'likes', 'saves', 'follows',
    'images', 'listing_attrs', 'listings', 'subcategories', 'categories', 'stores', 'users', 'settings',
  ]) {
    db.exec(`DELETE FROM ${table}`);
  }
  db.exec("DELETE FROM sqlite_sequence");
  console.log('Baza tozalandi.');
}

if (one('SELECT 1 AS x FROM users LIMIT 1')) {
  console.log('Bazada ma‘lumot bor. Qayta to‘ldirish uchun: npm run reset');
  process.exit(0);
}

/* ---------- kategoriyalar ---------- */
const CATEGORIES = [
  ['Elektronika', 'phone', '#e7f1f2', '#26384a', ['Telefonlar', 'Audio', 'Soatlar']],
  ['Ko‘chmas mulk', 'house', '#e8eefb', '#3f74d6', ['Sotuv', 'Ijara']],
  ['Xizmatlar', 'wrench', '#e4f0f4', '#2f8fb0', ['Santexnika', 'Elektrik', 'Tozalash']],
  ['Apteka', 'pill', '#e6f6ec', '#1f9d57', ['Dori', 'Vitamin', 'Tibbiy mol']],
  ['Oziq-ovqat', 'food', '#fff3d9', '#e0a53c', ['Asal', 'Quruq meva']],
  ['Kiyim', 'tshirt', '#fbeaf0', '#b0506a', ['Poyabzal', 'Sumka']],
  ['Uy-ro‘zg‘or', 'chair', '#eaf1e7', '#5a7550', ['Mebel', 'Oshxona']],
  ['Qurilish', 'drill', '#fff3d9', '#d09220', ['Asbob', 'Material']],
  ['Avto', 'car', '#eaeef5', '#3a4a63', ['Yengil', 'Ehtiyot qism']],
];

const catId = {};
CATEGORIES.forEach(([name, kind, bg, color, subs], i) => {
  const id = insert(
    'INSERT INTO categories (name, art_kind, art_bg, art_color, sort) VALUES (?, ?, ?, ?, ?)',
    name, kind, bg, color, i + 1
  );
  catId[name] = id;
  for (const sub of subs) {
    insert('INSERT INTO subcategories (category_id, name) VALUES (?, ?)', id, sub);
  }
});

/* ---------- foydalanuvchilar ---------- */
const mkUser = (name, username, email, role) =>
  insert(
    'INSERT INTO users (name, username, email, password_hash, role) VALUES (?, ?, ?, ?, ?)',
    name, username, email, hashPassword('parol123'), role
  );

const adminId = mkUser('Akmal Karimov', 'admin', 'admin@rasta.uz', 'admin');
const buyerId = mkUser('Dilnoza Rahimova', 'dilnoza', 'dilnoza@mail.uz', 'buyer');
const sellers = {
  texnomart: mkUser('Sardor Toshev', 'texnomart_owner', 'sardor@rasta.uz', 'seller'),
  uymakon: mkUser('Nodira Yusupova', 'uymakon_owner', 'nodira@rasta.uz', 'seller'),
  dorimed: mkUser('Javohir Aliev', 'dorimed_owner', 'javohir@rasta.uz', 'seller'),
};
const personalId = mkUser('Bekzod Karimov', 'bekzod_k', 'bekzod@mail.uz', 'seller');

/* ---------- do'konlar ---------- */
const mkStore = (ownerId, slug, title, category, area, bio, color) =>
  insert(
    `INSERT INTO stores (owner_id, slug, title, category, area, bio, color, verified, status)
     VALUES (?, ?, ?, ?, ?, ?, ?, 1, 'active')`,
    ownerId, slug, title, category, area, bio, color
  );

const storeId = {
  texnomart: mkStore(sellers.texnomart, 'texnomart', 'TexnoMart', 'Elektronika', 'Chilonzor, Toshkent',
    'Rasmiy elektronika va maishiy texnika. 12 oy kafolat.', '#0c9b88'),
  uymakon: mkStore(sellers.uymakon, 'uymakon', 'Uy Makon', 'Ko‘chmas mulk', 'Yunusobod, Toshkent',
    'Kvartira, uy va tijorat obyektlari. Rasmiy shartnoma bilan.', '#3f74d6'),
  dorimed: mkStore(sellers.dorimed, 'dorimed', 'DoriMed Apteka', 'Apteka', 'Chilonzor, Toshkent',
    'Dori-darmon, vitamin va tibbiy mollar. Litsenziyalangan apteka.', '#1f9d57'),
};

/* ---------- e'lonlar ---------- */
const LISTINGS = [
  {
    owner: sellers.texnomart, store: storeId.texnomart, type: 'product', cat: 'Elektronika',
    sub: 'Telefonlar', title: 'Samsung Galaxy A54 256GB', price: 3200000, condition: 'Yangi',
    stock: '24 dona', area: 'Chilonzor', kind: 'phone', color: '#26384a', bg: '#e7f1f2',
    keywords: 'telefon, samsung, android, smartfon, galaxy',
    desc: 'Rasmiy Samsung Galaxy A54 256GB, grafit rang. Barcha aksessuarlari va 12 oy rasmiy kafolat bilan. Do‘kondan olib ketish yoki yetkazib berish mavjud.',
    attrs: [['Brend', 'Samsung'], ['Model', 'Galaxy A54'], ['Kafolat', '12 oy'], ['SKU', 'SM-A54-256-GR']],
  },
  {
    owner: sellers.texnomart, store: storeId.texnomart, type: 'product', cat: 'Elektronika',
    sub: 'Audio', title: 'ProSound X2 simsiz quloqchin', price: 485000, condition: 'Yangi',
    stock: '8 dona', area: 'Chilonzor', kind: 'buds', color: '#6f58a4', bg: '#efeafa',
    keywords: 'quloqchin, naushnik, simsiz, bluetooth, audio',
    desc: 'ProSound X2 simsiz quloqchin. Bluetooth 5.3, 28 soatgacha ishlash, faol shovqin bostirish. Original, muhrlangan qutida.',
    attrs: [['Brend', 'ProSound'], ['Kafolat', '6 oy'], ['SKU', 'PS-X2-BLK']],
  },
  {
    owner: sellers.texnomart, store: storeId.texnomart, type: 'product', cat: 'Elektronika',
    sub: 'Soatlar', title: 'Galaxy Watch 6 aqlli soat', price: 1900000, condition: 'Yangi',
    stock: '9 dona', area: 'Chilonzor', kind: 'watch', color: '#2b6f66', bg: '#e5f3f0',
    keywords: 'soat, aqlli soat, smart watch, galaxy',
    desc: 'Galaxy Watch 6, 44mm, AMOLED ekran. Sog‘liq va fitnes funksiyalari, GPS. 12 oy kafolat.',
    attrs: [['Brend', 'Samsung'], ['Kafolat', '12 oy']],
  },
  {
    owner: sellers.uymakon, store: storeId.uymakon, type: 'property', cat: 'Ko‘chmas mulk',
    deal: 'Sotuv', title: '2 xonali kvartira, 62 m²', price: 480000000,
    area: 'Yunusobod', kind: 'house', color: '#3f74d6', bg: '#e8eefb',
    keywords: 'kvartira, uy, ko‘chmas mulk, yunusobod, sotuv',
    desc: 'Yunusobodda 2 xonali kvartira, 62 m², 4/9 qavat. Ta‘mirli, mebel bilan. Rasmiy shartnoma orqali sotiladi.',
    attrs: [['Xonalar soni', '2'], ['Maydon (m²)', '62'], ['Qavat (masalan 4/9)', '4/9'], ['Ta‘mir holati', 'Ta‘mirli']],
  },
  {
    owner: sellers.uymakon, store: storeId.uymakon, type: 'property', cat: 'Ko‘chmas mulk',
    deal: 'Ijara', title: 'Ijaraga 1 xonali kvartira', price: 4500000, price_note: 'oyiga',
    area: 'Chilonzor', kind: 'house', color: '#5b7fd6', bg: '#eaf0fc',
    keywords: 'ijaraga, ijara, kvartira, arenda, 1 xona, chilonzor',
    desc: 'Chilonzorda 1 xonali kvartira ijaraga, 38 m², 6/9 qavat. Mebel va texnika bilan. Oylik to‘lov, uzoq muddatga.',
    attrs: [['Xonalar soni', '1'], ['Maydon (m²)', '38'], ['Qavat (masalan 4/9)', '6/9']],
  },
  {
    owner: sellers.dorimed, store: storeId.dorimed, type: 'product', cat: 'Apteka',
    sub: 'Vitamin', title: 'Vitamin C 1000mg, 30 tabletka', price: 45000, condition: 'Yangi',
    stock: '120 dona', area: 'Chilonzor', kind: 'pill', color: '#1f9d57', bg: '#e6f6ec',
    keywords: 'dori, vitamin, apteka, immunitet, tabletka',
    desc: 'Vitamin C 1000mg, 30 tabletka. Immunitetni qo‘llab-quvvatlash uchun. Litsenziyalangan aptekadan, retseptsiz.',
    attrs: [['Brend', 'PharmaUZ'], ['Kafolat', '—']],
  },
  {
    owner: personalId, store: null, type: 'service', cat: 'Xizmatlar',
    sub: 'Santexnika', title: 'Santexnika ustasi xizmati', price: null, price_note: 'kelishiladi',
    area: 'Toshkent bo‘ylab', kind: 'wrench', color: '#2f8fb0', bg: '#e4f0f4',
    keywords: 'usta, santexnik, truba, kran, ta‘mir, xizmat',
    desc: 'Malakali santexnika ustasi. Truba, kran, smesitel o‘rnatish va ta‘mirlash. 8 yil tajriba, Toshkent bo‘ylab chaqiruv.',
    attrs: [['Xizmat turi', 'Santexnika'], ['Tajriba (yil)', '8'], ['Xizmat hududi', 'Toshkent bo‘ylab']],
  },
  {
    owner: personalId, store: null, type: 'product', cat: 'Qurilish',
    sub: 'Asbob', title: 'Akkumulyatorli LED fonar', price: 120000, condition: 'Yangi',
    stock: '30 dona', area: 'Olmazor', kind: 'torch', color: '#3a4655', bg: '#eef1f5',
    keywords: 'fonar, fonarik, chiroq, led, qurilish',
    desc: 'Akkumulyatorli LED fonar (fonarik), 10W. To‘liq zaryadda 8 soat ishlaydi. Qurilish va uy uchun qulay.',
    attrs: [['Brend', 'LightPro'], ['Kafolat', '3 oy']],
  },
  {
    owner: personalId, store: null, type: 'car', cat: 'Avto',
    sub: 'Yengil', title: 'Chevrolet Malibu 2, 2021', price: 245000000, condition: 'Ishlatilgan',
    area: 'Sergeli', kind: 'car', color: '#3a4a63', bg: '#eaeef5',
    keywords: 'avto, mashina, chevrolet, malibu, avtomobil',
    desc: 'Chevrolet Malibu 2, 2021-yil. Bir egadan, avariyasiz, to‘liq ta‘minot. Probeg 45 000 km.',
    attrs: [['Marka', 'Chevrolet'], ['Ishlab chiqarilgan yil', '2021'], ['Probeg (km)', '45 000'], ['Yoqilg‘i turi', 'Benzin']],
  },
  {
    owner: personalId, store: null, type: 'product', cat: 'Oziq-ovqat',
    sub: 'Asal', title: 'Tabiiy tog‘ asali, 1 kg', price: 95000, condition: 'Yangi',
    stock: '8 dona', area: 'Parkent', kind: 'honey', color: '#d09220', bg: '#fff3d9',
    keywords: 'asal, tabiiy, tog‘, parkent, oziq-ovqat',
    desc: 'Parkent tog‘laridan tabiiy asal, 1 kg shisha idishda. 2026-yil hosili, qo‘shimchasiz.',
    attrs: [['Brend', 'Uy sharoitida']],
  },
];

for (const item of LISTINGS) {
  const id = insert(
    `INSERT INTO listings (owner_id, store_id, type, category_id, subcategory, title, description,
       price, price_note, condition, deal, stock, area, keywords, art_kind, art_color, art_bg, status)
     VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,'active')`,
    item.owner, item.store, item.type, catId[item.cat], item.sub ?? null, item.title, item.desc,
    item.price ?? null, item.price_note ?? null, item.condition ?? null, item.deal ?? null,
    item.stock ?? '', item.area, item.keywords, item.kind, item.color, item.bg
  );
  let sort = 0;
  for (const [key, value] of item.attrs || []) {
    insert('INSERT INTO listing_attrs (listing_id, key, value, sort) VALUES (?,?,?,?)', id, key, value, sort++);
  }
  run('UPDATE listings SET views = ? WHERE id = ?', Math.floor(Math.random() * 900) + 60, id);
}

/* ---------- moderatsiya navbati uchun bitta e'lon ---------- */
insert(
  `INSERT INTO listings (owner_id, store_id, type, category_id, title, description, price,
     condition, stock, area, keywords, art_kind, art_color, art_bg, status)
   VALUES (?,?,'product',?,?,?,?,'Yangi','5 dona','Yakkasaroy','kreslo, mebel, stul','chair','#5a7550','#eaf1e7','pending')`,
  sellers.texnomart, storeId.texnomart, catId['Uy-ro‘zg‘or'],
  'Skandinaviya uslubidagi kreslo',
  'Yong‘och ramkali, yumshoq mato qoplamali kreslo. Uy yoki ofis uchun.',
  1280000
);

/* ---------- obuna, saqlangan, sharh, xabar ---------- */
run('INSERT INTO follows (user_id, store_id, notify) VALUES (?, ?, 1)', buyerId, storeId.texnomart);
run('INSERT INTO follows (user_id, store_id, notify) VALUES (?, ?, 0)', buyerId, storeId.uymakon);
run('INSERT INTO saves (user_id, listing_id) VALUES (?, 1)', buyerId);
run('INSERT INTO likes (user_id, listing_id) VALUES (?, 1)', buyerId);

insert('INSERT INTO reviews (store_id, user_id, rating, text) VALUES (?,?,?,?)',
  storeId.texnomart, buyerId, 5, 'Telefon original, kafolat hujjatlari bilan keldi. Tavsiya qilaman.');
insert('INSERT INTO reviews (store_id, user_id, rating, text) VALUES (?,?,?,?)',
  storeId.dorimed, buyerId, 5, 'Dori bor edi, tez topib berishdi. Narx hamyonbop.');

insert('INSERT INTO messages (listing_id, from_user_id, to_user_id, body) VALUES (?,?,?,?)',
  1, buyerId, sellers.texnomart, 'Assalomu alaykum! Grafit rang bormi? Narxi oxirgimi?');

audit({ actor: { id: adminId, name: 'Akmal Karimov', role: 'admin' }, action: 'Baza to‘ldirildi', target: 'seed', details: `${LISTINGS.length + 1} e‘lon` });

console.log(`Tayyor:
  kategoriya : ${CATEGORIES.length}
  do‘kon     : 3
  e‘lon      : ${LISTINGS.length + 1} (1 tasi moderatsiyada)

Kirish uchun (parol hammasida: parol123)
  admin@rasta.uz    — super admin
  sardor@rasta.uz   — sotuvchi (TexnoMart)
  dilnoza@mail.uz   — xaridor`);
