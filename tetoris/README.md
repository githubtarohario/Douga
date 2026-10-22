# テトリス（JavaScript + Vercel ランキング）

素の HTML / CSS / JavaScript で動くテトリスです。スコアは Vercel Function（`api/scores.js`）経由で
Upstash Redis に保存され、上位10件のランキングを表示します。

## 操作

| キー | 操作 |
| --- | --- |
| ← → | 移動 |
| ↑ / X | 右回転 |
| Z | 左回転 |
| ↓ | ソフトドロップ |
| Space | ハードドロップ |
| C / Shift | ホールド |
| P / Esc | 一時停止 |

スマホでは画面下のボタンで操作できます。

## Vercel へのデプロイ

```bash
npm i -g vercel
vercel link                              # プロジェクトを作成・リンク
vercel integration add upstash           # Upstash for Redis を追加（KV_REST_API_URL / KV_REST_API_TOKEN が自動設定）
vercel env pull .env.local               # ローカル開発用に環境変数を取得
vercel dev                               # http://localhost:3000 で動作確認
vercel --prod                            # 本番デプロイ
```

ダッシュボードから行う場合は、プロジェクトの **Storage → Create Database → Upstash for Redis** で接続してください。

## API

- `GET /api/scores` … 上位10件を取得
- `POST /api/scores` … `{ name, score, lines, level }` を登録（上位100件を保持）
