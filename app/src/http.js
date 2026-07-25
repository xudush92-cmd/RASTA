import { randomUUID } from 'node:crypto';

/** HTML uchun xavfsiz matn. Har qanday foydalanuvchi kiritgan qiymat shu orqali chiqariladi. */
export function esc(value) {
  if (value === null || value === undefined) return '';
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

export function html(res, body, status = 200, headers = {}) {
  res.writeHead(status, {
    'content-type': 'text/html; charset=utf-8',
    'cache-control': 'no-store',
    'x-content-type-options': 'nosniff',
    ...headers,
  });
  res.end(body);
}

export function json(res, data, status = 200) {
  res.writeHead(status, { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' });
  res.end(JSON.stringify(data));
}

export function redirect(res, location, headers = {}) {
  res.writeHead(303, { location, ...headers });
  res.end();
}

export function notFound(res, body = 'Topilmadi') {
  html(res, body, 404);
}

export function parseCookies(req) {
  const header = req.headers.cookie;
  if (!header) return {};
  const out = {};
  for (const part of header.split(';')) {
    const idx = part.indexOf('=');
    if (idx < 0) continue;
    out[part.slice(0, idx).trim()] = decodeURIComponent(part.slice(idx + 1).trim());
  }
  return out;
}

export function cookie(name, value, { maxAge = 60 * 60 * 24 * 30, httpOnly = true } = {}) {
  const parts = [`${name}=${encodeURIComponent(value)}`, 'Path=/', `Max-Age=${maxAge}`, 'SameSite=Lax'];
  if (httpOnly) parts.push('HttpOnly');
  return parts.join('; ');
}

export const clearCookie = (name) => `${name}=; Path=/; Max-Age=0; SameSite=Lax; HttpOnly`;

const MAX_BODY = 12 * 1024 * 1024; // 12 MB — rasm yuklash uchun

function readBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    let size = 0;
    req.on('data', (chunk) => {
      size += chunk.length;
      if (size > MAX_BODY) {
        reject(new Error('Yuklangan ma‘lumot juda katta (12 MB dan oshdi)'));
        req.destroy();
        return;
      }
      chunks.push(chunk);
    });
    req.on('end', () => resolve(Buffer.concat(chunks)));
    req.on('error', reject);
  });
}

/**
 * Formani o'qiydi. urlencoded va multipart/form-data ni qo'llab-quvvatlaydi.
 * Natija: { fields: {name: value}, files: [{field, filename, type, data}] }
 */
export async function parseForm(req) {
  const type = req.headers['content-type'] || '';
  const raw = await readBody(req);

  if (type.startsWith('application/x-www-form-urlencoded')) {
    const params = new URLSearchParams(raw.toString('utf8'));
    const fields = {};
    for (const [key, value] of params) fields[key] = value;
    return { fields, files: [] };
  }

  if (type.startsWith('multipart/form-data')) {
    const match = /boundary=(?:"([^"]+)"|([^;]+))/i.exec(type);
    if (!match) return { fields: {}, files: [] };
    return parseMultipart(raw, (match[1] || match[2]).trim());
  }

  if (type.startsWith('application/json')) {
    try {
      return { fields: JSON.parse(raw.toString('utf8') || '{}'), files: [] };
    } catch {
      return { fields: {}, files: [] };
    }
  }

  return { fields: {}, files: [] };
}

function parseMultipart(buffer, boundary) {
  const fields = {};
  const files = [];
  const delimiter = Buffer.from(`--${boundary}`);
  let position = buffer.indexOf(delimiter);

  while (position !== -1) {
    const partStart = position + delimiter.length;
    // Oxirgi chegara: "--boundary--"
    if (buffer.slice(partStart, partStart + 2).toString() === '--') break;

    const next = buffer.indexOf(delimiter, partStart);
    if (next === -1) break;

    const part = buffer.slice(partStart, next);
    const headerEnd = part.indexOf('\r\n\r\n');
    if (headerEnd === -1) {
      position = next;
      continue;
    }

    const headers = part.slice(0, headerEnd).toString('utf8');
    // Oxiridagi \r\n ni olib tashlaymiz
    const content = part.slice(headerEnd + 4, part.length - 2);

    const nameMatch = /name="([^"]*)"/i.exec(headers);
    if (!nameMatch) {
      position = next;
      continue;
    }
    const field = nameMatch[1];
    const fileMatch = /filename="([^"]*)"/i.exec(headers);

    if (fileMatch) {
      if (fileMatch[1] && content.length > 0) {
        const typeMatch = /content-type:\s*([^\r\n]+)/i.exec(headers);
        files.push({
          field,
          filename: fileMatch[1],
          type: (typeMatch?.[1] || 'application/octet-stream').trim(),
          data: content,
        });
      }
    } else {
      fields[field] = content.toString('utf8');
    }

    position = next;
  }

  return { fields, files };
}

/** Oddiy CSRF himoyasi: sessiyaga bog'langan token. */
export const newToken = () => randomUUID().replaceAll('-', '');
