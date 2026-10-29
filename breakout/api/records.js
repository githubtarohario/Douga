import { redis, keys, json, readBody, currentUser } from './_db.js';

const MAX_SCORE = 9_999_999;
const HISTORY_SIZE = 50;

function toInt(v, max) {
  const n = Number(v);
  return Number.isInteger(n) && n >= 0 && n <= max ? n : null;
}

// 各ユーザの自己ベスト上位10件
async function ranking(limit = 10) {
  const rows = await redis.zrange(keys.best, 0, limit - 1, { rev: true, withScores: true });
  const ids = [];
  for (let i = 0; i < rows.length; i += 2) ids.push({ userId: rows[i], score: Number(rows[i + 1]) });
  if (!ids.length) return [];
  const p = redis.pipeline();
  for (const r of ids) p.hget(keys.user(r.userId), 'name');
  const names = await p.exec();
  return ids.map((r, i) => ({ ...r, name: names[i] ?? r.userId }));
}

async function mine(userId) {
  const [best, rank, history] = await Promise.all([
    redis.zscore(keys.best, userId),
    redis.zrevrank(keys.best, userId),
    redis.lrange(keys.history(userId), 0, HISTORY_SIZE - 1),
  ]);
  return {
    best: best == null ? null : Number(best),
    rank: rank == null ? null : Number(rank) + 1,
    history: history.map((h) => JSON.parse(h)),
  };
}

export async function GET(request) {
  if (!redis) return json(503, { error: 'データベースが未設定です' });
  const user = await currentUser(request);
  return json(200, { ranking: await ranking(), mine: user ? await mine(user.userId) : null });
}

// { score, level } をログイン中のユーザの記録として保存
export async function POST(request) {
  if (!redis) return json(503, { error: 'データベースが未設定です' });
  const user = await currentUser(request);
  if (!user) return json(401, { error: 'ログインしてください' });

  const body = await readBody(request);
  const score = toInt(body?.score, MAX_SCORE);
  const level = toInt(body?.level, 999);
  if (score === null || level === null) return json(400, { error: 'スコアが不正です' });

  const prevBest = await redis.zscore(keys.best, user.userId);
  const entry = { score, level, date: new Date().toISOString() };
  await redis.lpush(keys.history(user.userId), JSON.stringify(entry));
  await redis.ltrim(keys.history(user.userId), 0, HISTORY_SIZE - 1);
  // 自己ベストを上回ったときだけ更新
  await redis.zadd(keys.best, { gt: true }, { score, member: user.userId });

  const newBest = prevBest == null || score > Number(prevBest);
  return json(201, { entry, newBest, ranking: await ranking(), mine: await mine(user.userId) });
}
