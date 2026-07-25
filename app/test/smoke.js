/**
 * Uchidan-uchiga tekshiruv. Serverni o'zi ishga tushiradi va yopadi.
 * Ishga tushirish: npm test
 */
import { spawn } from 'node:child_process';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const PORT = Number(process.env.TEST_PORT || 3987);
const BASE = `http://127.0.0.1:${PORT}`;
const DATA_DIR = mkdtempSync(join(tmpdir(), 'rasta-test-'));

let passed = 0;
let failed = 0;

function check(name, condition, extra = '') {
  if (condition) {
    passed++;
    console.log(`  ok   ${name}`);
  } else {
    failed++;
    console.log(`  FAIL ${name}${extra ? ` — ${extra}` : ''}`);
  }
}

const nodeArgs = ['--experimental-sqlite'];
const env = { ...process.env, RASTA_DATA_DIR: DATA_DIR, PORT: String(PORT), NODE_OPTIONS: '' };

function runNode(script) {
  return new Promise((resolve, reject) => {
    const child = spawn(process.execPath, [...nodeArgs, script], { env, stdio: 'ignore' });
    child.on('exit', (code) => (code === 0 ? resolve() : reject(new Error(`${script} → ${code}`))));
    child.on('error', reject);
  });
}

async function waitForServer(attempts = 40) {
  for (let i = 0; i < attempts; i++) {
    try {
      const res = await fetch(BASE, { redirect: 'manual' });
      if (res.status) return;
    } catch {
      await new Promise((r) => setTimeout(r, 150));
    }
  }
  throw new Error('Server javob bermadi');
}

/** Cookie'ni saqlaydigan oddiy fetch. */
function makeClient() {
  let cookie = '';
  return async (path, options = {}) => {
    const res = await fetch(BASE + path, {
      ...options,
      redirect: 'manual',
      headers: { ...(options.headers || {}), ...(cookie ? { cookie } : {}) },
    });
    const setCookie = res.headers.get('set-cookie');
    if (setCookie) cookie = setCookie.split(';')[0];
    return res;
  };
}

const form = (obj) => new URLSearchParams(obj).toString();
const POST_FORM = { 'content-type': 'application/x-www-form-urlencoded' };

let server;
try {
  console.log('Baza tayyorlanmoqda...');
  await runNode('src/seed.js');

  server = spawn(process.execPath, [...nodeArgs, 'src/server.js'], { env, stdio: 'ignore' });
  await waitForServer();
  console.log(`Server tayyor: ${BASE}\n`);

  /* ---- public sahifalar ---- */
  console.log('Public sahifalar:');
  const home = await fetch(BASE);
  const homeHtml = await home.text();
  check('bosh sahifa 200', home.status === 200);
  check('e‘lonlar ko‘rinadi', homeHtml.includes('Samsung Galaxy A54'));
  check('kategoriyalar ko‘rinadi', homeHtml.includes('Ko‘chmas mulk'));
  check('to‘lov tizimi yo‘q', !/savat|checkout|karta bilan to‘lash/i.test(homeHtml));

  const rent = await (await fetch(`${BASE}/?cat=${encodeURIComponent('Ko‘chmas mulk')}&sub=Ijara`)).text();
  check('ijara filtri ishlaydi', rent.includes('Ijaraga 1 xonali') && !rent.includes('Samsung'));

  const search = await (await fetch(`${BASE}/explore?q=fonarik`)).text();
  check('kalit so‘z qidiruvi (fonarik)', search.includes('120 000'));

  const detail = await (await fetch(`${BASE}/listing/1`)).text();
  check('e‘lon batafsil sahifasi', detail.includes('Samsung Galaxy A54') && detail.includes('3 200 000'));
  check('o‘xshash e‘lonlar bo‘limi', detail.includes('xshash e‘lonlar'));

  const store = await (await fetch(`${BASE}/store/texnomart`)).text();
  check('do‘kon profili', store.includes('TexnoMart') && store.includes('obunachi'));

  /* ---- himoya ---- */
  console.log('\nRuxsatlar:');
  check('/admin — kirmaganda redirect', (await fetch(`${BASE}/admin`, { redirect: 'manual' })).status === 303);
  check('/seller — kirmaganda redirect', (await fetch(`${BASE}/seller`, { redirect: 'manual' })).status === 303);
  check('API — kirmaganda 401', (await fetch(`${BASE}/api/save/1`, { method: 'POST' })).status === 401);

  const buyerTriesAdmin = makeClient();
  await buyerTriesAdmin('/login', { method: 'POST', headers: POST_FORM, body: form({ login: 'dilnoza@mail.uz', password: 'parol123' }) });
  check('xaridor admin panelga kira olmaydi', (await buyerTriesAdmin('/admin')).status === 403);

  /* ---- xaridor oqimi ---- */
  console.log('\nXaridor:');
  const buyer = makeClient();
  const login = await buyer('/login', { method: 'POST', headers: POST_FORM, body: form({ login: 'dilnoza@mail.uz', password: 'parol123' }) });
  check('kirish muvaffaqiyatli', login.status === 303);
  check('xato parol qabul qilinmaydi',
    (await fetch(`${BASE}/login`, { method: 'POST', headers: POST_FORM, body: form({ login: 'dilnoza@mail.uz', password: 'xato' }) })).status === 401);

  const saveRes = await buyer('/api/save/2', { method: 'POST' });
  const saveJson = await saveRes.json();
  check('saqlash ishlaydi', saveJson.on === true);
  check('saqlangan ro‘yxatda ko‘rinadi', (await (await buyer('/saved')).text()).includes('tile'));

  // 3-do'kon (DoriMed) — seed'da bu do'konga obuna bo'lmagan
  const followJson = await (await buyer('/api/follow/3', { method: 'POST' })).json();
  check('do‘konga obuna', followJson.on === true);
  const unfollowJson = await (await buyer('/api/follow/3', { method: 'POST' })).json();
  check('obunani bekor qilish', unfollowJson.on === false);
  const notifyJson = await (await buyer('/api/notify/3', { method: 'POST' })).json();
  check('qo‘ng‘iroqcha alohida ishlaydi', notifyJson.on === true);

  await buyer('/listing/1/message', { method: 'POST', headers: POST_FORM, body: form({ body: 'Kafolat bormi?' }) });
  check('xabar yuborildi', (await (await buyer('/messages')).text()).includes('Kafolat bormi'));

  /* ---- sotuvchi oqimi ---- */
  console.log('\nSotuvchi:');
  const seller = makeClient();
  await seller('/login', { method: 'POST', headers: POST_FORM, body: form({ login: 'sardor@rasta.uz', password: 'parol123' }) });
  check('kabinet ochiladi', (await (await seller('/seller')).text()).includes('TexnoMart'));

  const created = await seller('/new', {
    method: 'POST',
    headers: POST_FORM,
    body: form({
      type: 'product', title: 'Smoke test kolonka', category_id: '1', area: 'Chilonzor',
      condition: 'Yangi', price: '350000', stock: '5 dona',
      description: 'Avtomatik test tomonidan qo‘shilgan e‘lon.',
      keywords: 'kolonka, test', art_kind: 'buds', status: 'pending',
      attr_brend: 'TestBrand',
    }),
  });
  check('e‘lon yaratildi', created.status === 303);
  check('sotuvchida ko‘rinadi', (await (await seller('/seller/listings')).text()).includes('Smoke test kolonka'));
  check('tasdiqlanmaguncha publicda yo‘q', !(await (await fetch(BASE)).text()).includes('Smoke test kolonka'));

  /* ---- moderatsiya ---- */
  console.log('\nAdmin:');
  const admin = makeClient();
  await admin('/login', { method: 'POST', headers: POST_FORM, body: form({ login: 'admin@rasta.uz', password: 'parol123' }) });
  const modHtml = await (await admin('/admin/moderation')).text();
  check('moderatsiya navbatida ko‘rinadi', modHtml.includes('Smoke test kolonka'));

  const ids = [...modHtml.matchAll(/\/admin\/listing\/(\d+)\/approve/g)].map((m) => m[1]);
  await admin(`/admin/listing/${ids.at(-1)}/approve`, { method: 'POST' });
  check('tasdiqlangach publicda ko‘rinadi', (await (await fetch(BASE)).text()).includes('Smoke test kolonka'));

  /* ---- kategoriya CRUD ---- */
  await admin('/admin/categories', { method: 'POST', headers: POST_FORM, body: form({ name: 'SmokeCat', art_kind: 'all', art_bg: '#eee', subs: 'Bir, Ikki' }) });
  check('kategoriya qo‘shildi', (await (await fetch(BASE)).text()).includes('SmokeCat'));

  const catsHtml = await (await admin('/admin/categories')).text();
  const catId = [...catsHtml.matchAll(/categories\?edit=(\d+)/g)].map((m) => m[1]).at(-1);
  await admin(`/admin/categories/${catId}`, { method: 'POST', headers: POST_FORM, body: form({ name: 'SmokeCat2', art_kind: 'all', art_bg: '#eee', subs: 'Bir' }) });
  check('kategoriya tahrirlandi', (await (await fetch(BASE)).text()).includes('SmokeCat2'));

  await admin(`/admin/categories/${catId}/delete`, { method: 'POST' });
  check('kategoriya o‘chirildi', !(await (await fetch(BASE)).text()).includes('SmokeCat2'));

  const audit = await (await admin('/admin/audit')).text();
  check('audit logga yozildi', audit.includes('Kategoriya qo‘shildi') && audit.includes('E‘lon tasdiqlandi'));

  /* ---- xavfsizlik ---- */
  console.log('\nXavfsizlik:');
  const xss = makeClient();
  await xss('/login', { method: 'POST', headers: POST_FORM, body: form({ login: 'sardor@rasta.uz', password: 'parol123' }) });
  await xss('/new', {
    method: 'POST', headers: POST_FORM,
    body: form({
      type: 'product', title: '<script>alert(1)</script>', category_id: '1', area: 'Test',
      condition: 'Yangi', price: '1000', description: 'XSS sinovi', status: 'draft', art_kind: 'phone',
    }),
  });
  const draftPage = await (await xss('/seller/listings?status=draft')).text();
  check('XSS ekranlanadi', draftPage.includes('&lt;script&gt;') && !draftPage.includes('<script>alert(1)'));
  check('404 sahifa ishlaydi', (await fetch(`${BASE}/yoq-sahifa`)).status === 404);
} catch (err) {
  failed++;
  console.error('\nTest xatosi:', err.message);
} finally {
  server?.kill();
  rmSync(DATA_DIR, { recursive: true, force: true });
}

console.log(`\n${'-'.repeat(40)}\nNatija: ${passed} ok, ${failed} xato`);
process.exit(failed ? 1 : 0);
