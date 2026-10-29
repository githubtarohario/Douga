# ブロック崩し（ユーザ登録 + Vercel 記録保存）

素の HTML / JavaScript のブロック崩しです。ユーザ登録・ログインしたユーザのプレイ記録を
Vercel Function（`api/`）経由で Upstash Redis に保存します。ログインしなくても遊べますが、記録は保存されません。

- ゲームオーバー時にスコアとレベルを自動で保存
- 自分の記録: 自己ベスト・順位・直近のプレイ履歴（サーバには最新50件を保持）
- ランキング: 各ユーザの自己ベスト上位10件
- パスワードは scrypt でハッシュ化して保存、ログイン状態は30日有効のトークン（ブラウザの localStorage）

## Vercel へのデプロイ

```bash
npm i -g vercel
vercel link                              # プロジェクトを作成・リンク
vercel integration add upstash           # Upstash for Redis を追加（KV_REST_API_URL / KV_REST_API_TOKEN が自動設定）
vercel env pull .env.local               # ローカル開発用に環境変数を取得
vercel dev                               # http://localhost:3000 で動作確認
vercel --prod                            # 本番デプロイ
```

## API

| メソッド | パス | 内容 |
| --- | --- | --- |
| `POST` | `/api/auth` | `{ action: "register", userId, password, name? }` で新規登録、`{ action: "login", userId, password }` でログイン。`token` を返す |
| `GET` | `/api/auth` | ログイン中のユーザを取得（`Authorization: Bearer <token>`） |
| `DELETE` | `/api/auth` | ログアウト |
| `GET` | `/api/records` | ランキング。ログイン中なら自分の記録も返す |
| `POST` | `/api/records` | `{ score, level }` を保存（要ログイン） |

ユーザIDは半角英数字と `_` で3〜20文字、パスワードは4〜64文字です。

## Redis のキー

| キー | 型 | 内容 |
| --- | --- | --- |
| `breakout:user:<userId>` | hash | `password`（scrypt ハッシュ）, `name`, `createdAt` |
| `breakout:session:<token>` | string | ユーザID（30日で失効） |
| `breakout:history:<userId>` | list | プレイ記録 `{ score, level, date }`（最新50件） |
| `breakout:best` | sorted set | ユーザごとの自己ベスト |
