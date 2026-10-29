import { randomBytes, scryptSync, timingSafeEqual } from 'node:crypto';
import { redis, keys, json, readBody, bearer, currentUser, SESSION_TTL } from './_db.js';

const USER_ID_RE = /^[A-Za-z0-9_]{3,20}$/;

function hashPassword(password, salt = randomBytes(16).toString('hex')) {
  return `scrypt$${salt}$${scryptSync(password, salt, 32).toString('hex')}`;
}

function verifyPassword(password, stored) {
  const [, salt, hash] = String(stored || '').split('$');
  if (!salt || !hash) return false;
  const a = Buffer.from(hashPassword(password, salt));
  const b = Buffer.from(String(stored));
  return a.length === b.length && timingSafeEqual(a, b);
}

async function createSession(userId) {
  const token = randomBytes(32).toString('hex');
  await redis.set(keys.session(token), userId, { ex: SESSION_TTL });
  return token;
}

// ログイン状態の確認
export async function GET(request) {
  if (!redis) return json(503, { error: 'データベースが未設定です' });
  const user = await currentUser(request);
  return user ? json(200, { user }) : json(401, { error: 'ログインしていません' });
}

// { action: 'register' | 'login', userId, password, name? }
export async function POST(request) {
  if (!redis) return json(503, { error: 'データベースが未設定です' });
  const body = await readBody(request);
  if (!body) return json(400, { error: '不正なリクエストです' });

  const userId = String(body.userId ?? '').trim();
  const password = String(body.password ?? '');
  if (!USER_ID_RE.test(userId)) {
    return json(400, { error: 'ユーザIDは半角英数字と _ で3〜20文字にしてください' });
  }
  if (password.length < 4 || password.length > 64) {
    return json(400, { error: 'パスワードは4〜64文字にしてください' });
  }

  if (body.action === 'register') {
    const name = String(body.name ?? '').trim().replace(/[\u0000-\u001f<>]/g, '').slice(0, 12) || userId;
    // hsetnx で同じIDの二重登録を防ぐ
    const created = await redis.hsetnx(keys.user(userId), 'password', hashPassword(password));
    if (!created) return json(409, { error: 'このユーザIDは既に使われています' });
    await redis.hset(keys.user(userId), { name, createdAt: new Date().toISOString() });
    return json(201, { token: await createSession(userId), user: { userId, name } });
  }

  if (body.action === 'login') {
    const [stored, name] = await Promise.all([
      redis.hget(keys.user(userId), 'password'),
      redis.hget(keys.user(userId), 'name'),
    ]);
    if (!verifyPassword(password, stored)) {
      return json(401, { error: 'ユーザIDまたはパスワードが違います' });
    }
    return json(200, { token: await createSession(userId), user: { userId, name } });
  }

  return json(400, { error: '不正なリクエストです' });
}

// ログアウト
export async function DELETE(request) {
  if (!redis) return json(503, { error: 'データベースが未設定です' });
  const t = bearer(request);
  if (t) await redis.del(keys.session(t));
  return json(200, { ok: true });
}
