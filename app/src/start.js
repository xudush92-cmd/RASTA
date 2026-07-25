/**
 * Hosting uchun ishga tushirish nuqtasi.
 * Baza bo'sh bo'lsa (masalan bepul hostingda qayta ishga tushgandan keyin),
 * avtomatik ravishda namuna ma'lumotlarni yuklaydi, so'ng serverni ishga tushiradi.
 */
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { one } from './db.js';

const isEmpty = !one('SELECT 1 AS x FROM users LIMIT 1');

if (isEmpty) {
  console.log('Baza bo‘sh — namuna ma‘lumotlar yuklanmoqda...');
  const result = spawnSync(
    process.execPath,
    ['--experimental-sqlite', fileURLToPath(new URL('./seed.js', import.meta.url))],
    { stdio: 'inherit', env: process.env }
  );
  if (result.status !== 0) {
    console.error('Namuna ma‘lumotlarni yuklab bo‘lmadi — server shunday ham ishga tushadi.');
  }
}

await import('./server.js');
