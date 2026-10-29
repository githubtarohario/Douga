import { Redis } from '@upstash/redis';

// Upstash for Redis (Vercel Marketplace) が注入する環境変数を利用
const url = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
const token = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
// 値は常に文字列で受け取る（"123" などが数値に化けないように）
export const redis = url && token ? new Redis({ url, token, automaticDeserialization: false }) : null;

export const SESSION_TTL = 60 * 60 * 24 * 30; // 30日

export const keys = {
  user: (id) => `breakout:user:${id}`,
  session: (t) => `breakout:session:${t}`,
  history: (id) => `breakout:history:${id}`,
  best: 'breakout:best',
};

export function json(status, body) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' },
  });
}

export async function readBody(request) {
  try {
    return await request.json();
  } catch {
    return null;
  }
}

export function bearer(request) {
  const m = /^Bearer ([0-9a-f]{64})$/.exec(request.headers.get('authorization') || '');
  return m ? m[1] : null;
}

// トークンからログイン中のユーザを取得（無効なら null）
export async function currentUser(request) {
  const t = bearer(request);
  if (!t) return null;
  const userId = await redis.get(keys.session(t));
  if (!userId) return null;
  const name = await redis.hget(keys.user(userId), 'name');
  return name == null ? null : { userId, name };
}
