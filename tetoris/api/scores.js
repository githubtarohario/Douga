import { Redis } from '@upstash/redis';

const KEY = 'tetris:scores';
const MAX_SCORE = 9_999_999;

// Upstash for Redis (Vercel Marketplace) が注入する環境変数を利用
const url = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
const token = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
const redis = url && token ? new Redis({ url, token }) : null;

function json(status, body) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' },
  });
}

function toInt(v, max) {
  const n = Number(v);
  return Number.isInteger(n) && n >= 0 && n <= max ? n : null;
}

async function top(limit = 10) {
  const rows = await redis.zrange(KEY, 0, limit - 1, { rev: true });
  return rows.map((r) => (typeof r === 'string' ? JSON.parse(r) : r));
}

export async function GET() {
  if (!redis) return json(503, { error: 'データベースが未設定です' });
  return json(200, { scores: await top() });
}

export async function POST(request) {
  if (!redis) return json(503, { error: 'データベースが未設定です' });

  let body;
  try {
    body = await request.json();
  } catch {
    return json(400, { error: '不正なリクエストです' });
  }

  const name = String(body.name ?? '').trim().replace(/[\u0000-\u001f<>]/g, '').slice(0, 12);
  const score = toInt(body.score, MAX_SCORE);
  const lines = toInt(body.lines, 99_999);
  const level = toInt(body.level, 999);
  if (!name || score === null || lines === null || level === null) {
    return json(400, { error: '名前またはスコアが不正です' });
  }

  const entry = { id: crypto.randomUUID(), name, score, lines, level, date: new Date().toISOString() };
  await redis.zadd(KEY, { score, member: JSON.stringify(entry) });
  // 上位100件のみ保持
  await redis.zremrangebyrank(KEY, 0, -101);

  const rank = (await redis.zrevrank(KEY, JSON.stringify(entry)));
  return json(201, { entry, rank: rank === null ? null : rank + 1, scores: await top() });
}
